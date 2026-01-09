import { Editor, MarkdownView, Plugin } from "obsidian";
import { DEFAULT_SETTINGS, DailyZettelSettingTab } from "./settings";
import type { DailyZettelSettings } from "./types/settings";
import { NoteManager } from "./core/note-manager";
import { ConnectionManager } from "./core/connection-manager";
import { PromotionService } from "./services/promotion-service";
import { extractSelection } from "./commands/extract-selection-command";
import { promoteNote } from "./commands/promote-note-command";

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

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new DailyZettelSettingTab(this.app, this));
	}

	onunload() {}

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
