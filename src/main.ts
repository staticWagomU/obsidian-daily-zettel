import { Editor, MarkdownView, Plugin, TFile, WorkspaceLeaf } from "obsidian";
import { DEFAULT_SETTINGS, PageZettelSettingTab } from "./settings";
import type { PageZettelSettings } from "./types/settings";
import { NoteManager } from "./core/note-manager";
import { PromotionService } from "./services/promotion-service";
import { FolderService } from "./services/folder-service";
import { TemplateService } from "./services/template-service";
import { FrontmatterService } from "./services/frontmatter-service";
import { NoteCreatorService } from "./services/note-creator-service";
import { extractSelection, extractSelectionToType } from "./commands/extract-selection-command";
import { promoteNote } from "./commands/promote-note-command";
import { OrphanView, VIEW_TYPE_ORPHAN } from "./ui/views/orphan-view";
import { QuickCaptureModal } from "./ui/modals/quick-capture-modal";
import { NoteTypeModal } from "./ui/modals/note-type-modal";
import { AliasInputModal } from "./ui/modals/alias-input-modal";
import { NoteType } from "./types/note-types";
import { t } from "./i18n";

export default class PageZettelPlugin extends Plugin {
	settings: PageZettelSettings;
	noteManager: NoteManager;
	promotionService: PromotionService;
	noteCreatorService: NoteCreatorService;

	async onload() {
		await this.loadSettings();

		// Initialize folder structure on first load
		const folderService = new FolderService(this.app, this.settings);
		await folderService.initializeAllFolders();

		// Initialize services
		this.noteManager = new NoteManager(this.app, this.settings);
		this.promotionService = new PromotionService(this.app, this.settings);

		// Initialize NoteCreatorService
		const templateService = new TemplateService(this.app, this.settings);
		const frontmatterService = new FrontmatterService(this.app);
		this.noteCreatorService = new NoteCreatorService(
			this.app,
			this.settings,
			folderService,
			templateService,
			frontmatterService,
		);

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
				? `📝 ${t("commands.extractToNote")}`
				: t("commands.extractToNote"),
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

		this.addCommand({
			id: "create-new-note",
			name: this.settings.ui.showEmojiInCommands
				? `📄 ${t("commands.createNewNote")}`
				: t("commands.createNewNote"),
			callback: () => {
				const modal = new NoteTypeModal(
					this.app,
					(type: NoteType) => {
						// 設定確認: showAliasInputフラグ
						const showAliasInput = this.settings[type].showAliasInput;

						if (!showAliasInput) {
							// showAliasInput=falseの場合、AliasInputModalをスキップしてノート作成
							void this.createNoteAndOpen(type, "");
							return;
						}

						// showAliasInput=trueの場合、AliasInputModalを表示
						const aliasModal = new AliasInputModal(
							this.app,
							this,
							(result) => {
								void this.createNoteAndOpen(type, result.alias);
							},
							false, // showRemoveIndent=false（Create時なのでインデント削除チェックボックス非表示）
						);
						aliasModal.open();
					},
					["fleeting", "literature", "permanent"],
				);
				modal.open();
			},
		});

		// Register editor context menu
		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, _info) => {
				if (!this.settings.ui.showContextMenuItems) return;

				menu.addSeparator();

				// 選択テキストがある場合のみ表示（各ノートタイプに直接切り出す）
				if (editor.getSelection()) {
					const noteTypes: { type: NoteType; icon: string; translationKey: string }[] = [
						{
							type: "fleeting",
							icon: "💡",
							translationKey: "commands.extractToFleeting",
						},
						{
							type: "literature",
							icon: "📚",
							translationKey: "commands.extractToLiterature",
						},
						{
							type: "permanent",
							icon: "💎",
							translationKey: "commands.extractToPermanent",
						},
					];

					for (const { type, icon, translationKey } of noteTypes) {
						menu.addItem((item) =>
							item
								.setSection("page-zettel")
								.setTitle(
									this.settings.ui.showEmojiInCommands
										? `${icon} ${t(translationKey)}`
										: t(translationKey),
								)
								.setIcon("file-plus")
								.onClick(() => {
									const view =
										this.app.workspace.getActiveViewOfType(MarkdownView);
									if (view) {
										void extractSelectionToType(this, editor, view, type);
									}
								}),
						);
					}
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
			}),
		);

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new PageZettelSettingTab(this.app, this));
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

	/**
	 * ノートを作成して開く
	 */
	async createNoteAndOpen(type: NoteType, alias: string): Promise<void> {
		// NoteCreatorServiceでノート作成
		const file = await this.noteCreatorService.createNote(type, "", alias);

		// 新規ノートを開く
		await this.app.workspace.openLinkText(file.path, "");
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<PageZettelSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
