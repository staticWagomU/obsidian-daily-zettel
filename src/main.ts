import { Editor, MarkdownView, Plugin, TFile, WorkspaceLeaf } from "obsidian";
import { DEFAULT_SETTINGS, DailyZettelSettingTab } from "./settings";
import type { DailyZettelSettings } from "./types/settings";
import { NoteManager } from "./core/note-manager";
import { ConnectionManager } from "./core/connection-manager";
import { PromotionService } from "./services/promotion-service";
import { FolderService } from "./services/folder-service";
import { extractSelection } from "./commands/extract-selection-command";
import { promoteNote } from "./commands/promote-note-command";
import { linkPermanent } from "./commands/link-permanent-command";
import { OrphanView, VIEW_TYPE_ORPHAN } from "./ui/views/orphan-view";
import { QuickCaptureModal } from "./ui/modals/quick-capture-modal";
import { t } from "./i18n";

export default class DailyZettelPlugin extends Plugin {
	settings: DailyZettelSettings;
	noteManager: NoteManager;
	connectionManager: ConnectionManager;
	promotionService: PromotionService;

	async onload() {
		await this.loadSettings();

		// Initialize folder structure on first load
		const folderService = new FolderService(this.app, this.settings);
		await folderService.initializeAllFolders();

		// Initialize services
		this.noteManager = new NoteManager(this.app, this.settings);
		this.connectionManager = new ConnectionManager(this.app);
		this.promotionService = new PromotionService(this.app, this.settings);

		// Register views
		this.registerView(VIEW_TYPE_ORPHAN, (leaf) => new OrphanView(leaf, this.settings));

		// Add ribbon icon to open orphan view
		this.addRibbonIcon("unlink", t("ribbon.orphanView"), () => {
			void this.activateOrphanView();
		});

		// Register commands
		this.addCommand({
			id: "extract-selection",
			name: this.settings.ui.showEmojiInCommands
				? `📝 ${t("commands.extractSelection")}`
				: t("commands.extractSelection"),
			editorCallback: (editor: Editor, view: MarkdownView) => {
				void extractSelection(this, editor, view);
			},
		});

		this.addCommand({
			id: "promote-note",
			name: this.settings.ui.showEmojiInCommands
				? `⬆️ ${t("commands.promoteNote")}`
				: t("commands.promoteNote"),
			callback: () => {
				void promoteNote(this);
			},
		});

		this.addCommand({
			id: "link-permanent",
			name: this.settings.ui.showEmojiInCommands
				? `🔗 ${t("commands.linkPermanent")}`
				: t("commands.linkPermanent"),
			callback: () => {
				void linkPermanent(this);
			},
		});

		this.addCommand({
			id: "quick-fleeting",
			name: this.settings.ui.showEmojiInCommands
				? `⚡ ${t("commands.quickFleeting")}`
				: t("commands.quickFleeting"),
			callback: () => {
				const modal = new QuickCaptureModal(this.app, this, (title: string) => {
					void (async () => {
						const file = await this.noteManager.createNote({
							title,
							type: "fleeting",
							content: "",
						});
						// 新規ノートを開く
						const leaf = this.app.workspace.getLeaf(false);
						await leaf.openFile(file);
					})();
				});
				modal.open();
			},
		});

		// Register editor context menu
		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, _info) => {
				if (!this.settings.ui.showContextMenuItems) return;

				menu.addSeparator();

				// 選択テキストがある場合のみ表示
				if (editor.getSelection()) {
					menu.addItem((item) =>
						item
							.setSection("page-zettel")
							.setTitle(
								this.settings.ui.showEmojiInCommands
									? `📝 ${t("commands.extractSelection")}`
									: t("commands.extractSelection"),
							)
							.setIcon("file-plus")
							.onClick(() => {
								const view = this.app.workspace.getActiveViewOfType(MarkdownView);
								if (view) {
									void extractSelection(this, editor, view);
								}
							}),
					);
				}

				// 常時表示
				menu.addItem((item) =>
					item
						.setSection("page-zettel")
						.setTitle(
							this.settings.ui.showEmojiInCommands
								? `⬆️ ${t("commands.promoteNote")}`
								: t("commands.promoteNote"),
						)
						.setIcon("arrow-up")
						.onClick(() => void promoteNote(this)),
				);

				menu.addItem((item) =>
					item
						.setSection("page-zettel")
						.setTitle(
							this.settings.ui.showEmojiInCommands
								? `🔗 ${t("commands.linkPermanent")}`
								: t("commands.linkPermanent"),
						)
						.setIcon("link")
						.onClick(() => void linkPermanent(this)),
				);
			}),
		);

		// Register file context menu
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				if (!this.settings.ui.showContextMenuItems) return;
				if (!(file instanceof TFile) || file.extension !== "md") return;

				menu.addSeparator();

				menu.addItem((item) =>
					item
						.setSection("page-zettel")
						.setTitle(
							this.settings.ui.showEmojiInCommands
								? `⬆️ ${t("commands.promoteNote")}`
								: t("commands.promoteNote"),
						)
						.setIcon("arrow-up")
						.onClick(() => void promoteNote(this)),
				);

				menu.addItem((item) =>
					item
						.setSection("page-zettel")
						.setTitle(
							this.settings.ui.showEmojiInCommands
								? `🔗 ${t("commands.linkPermanent")}`
								: t("commands.linkPermanent"),
						)
						.setIcon("link")
						.onClick(() => void linkPermanent(this)),
				);
			}),
		);

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new DailyZettelSettingTab(this.app, this));
	}

	onunload() {
		// Clean up if needed
	}

	/**
	 * OrphanViewをアクティブにする
	 */
	async activateOrphanView(): Promise<void> {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_ORPHAN);

		if (leaves.length > 0) {
			// すでに開いている場合は、そのリーフを使用
			leaf = leaves[0] ?? null;
		} else {
			// 新しいリーフを右サイドバーに作成
			const rightLeaf = workspace.getRightLeaf(false);
			if (rightLeaf) {
				await rightLeaf.setViewState({ type: VIEW_TYPE_ORPHAN, active: true });
				leaf = rightLeaf;
			}
		}

		// リーフをアクティブにして表示
		if (leaf) {
			void workspace.revealLeaf(leaf);
		}
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<DailyZettelSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
