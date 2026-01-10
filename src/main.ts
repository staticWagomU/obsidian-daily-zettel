import { Editor, MarkdownView, Plugin, WorkspaceLeaf } from "obsidian";
import { DEFAULT_SETTINGS, DailyZettelSettingTab } from "./settings";
import type { DailyZettelSettings } from "./types/settings";
import { NoteManager } from "./core/note-manager";
import { ConnectionManager } from "./core/connection-manager";
import { PromotionService } from "./services/promotion-service";
import { extractSelection } from "./commands/extract-selection-command";
import { promoteNote } from "./commands/promote-note-command";
import { linkPermanent } from "./commands/link-permanent-command";
import { OrphanView, VIEW_TYPE_ORPHAN } from "./ui/views/orphan-view";
import { QuickCaptureModal } from "./ui/modals/quick-capture-modal";

export default class DailyZettelPlugin extends Plugin {
	settings: DailyZettelSettings;
	noteManager: NoteManager;
	connectionManager: ConnectionManager;
	promotionService: PromotionService;

	async onload() {
		await this.loadSettings();

		// Initialize services
		this.noteManager = new NoteManager(this.app, this.settings);
		this.connectionManager = new ConnectionManager(this.app);
		this.promotionService = new PromotionService(this.app, this.settings);

		// Register views
		this.registerView(VIEW_TYPE_ORPHAN, (leaf) => new OrphanView(leaf, this.settings));

		// Add ribbon icon to open orphan view
		this.addRibbonIcon("unlink", "Orphan permanent notes", () => {
			void this.activateOrphanView();
		});

		// Register commands
		this.addCommand({
			id: "extract-selection",
			name: this.settings.ui.showEmojiInCommands
				? "📝 選択範囲から新規ノート"
				: "選択範囲から新規ノート",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				void extractSelection(this, editor, view);
			},
		});

		this.addCommand({
			id: "promote-note",
			name: this.settings.ui.showEmojiInCommands ? "⬆️ ノートを昇格" : "ノートを昇格",
			callback: () => {
				void promoteNote(this);
			},
		});

		this.addCommand({
			id: "link-permanent",
			name: this.settings.ui.showEmojiInCommands
				? "🔗 Structure Note に接続"
				: "Structure Note に接続",
			callback: () => {
				void linkPermanent(this);
			},
		});

		this.addCommand({
			id: "quick-fleeting",
			name: this.settings.ui.showEmojiInCommands
				? "⚡ Quick fleeting note"
				: "Quick fleeting note",
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
