import { App } from "obsidian";
import { NoteType, NOTE_TYPE_CONFIG } from "../types/note-types";
import type { DailyZettelSettings } from "../types/settings";

export class FolderService {
	private app: App;
	private settings: DailyZettelSettings;

	constructor(app: App, settings: DailyZettelSettings) {
		this.app = app;
		this.settings = settings;
	}

	/**
	 * ノートタイプに対応するフォルダパスを取得
	 */
	getFolderPath(type: NoteType): string {
		return this.settings.folders.typeFolders[type] || NOTE_TYPE_CONFIG[type].folder;
	}

	/**
	 * フォルダが存在することを確認し、なければ作成
	 */
	async ensureFolderExists(type: NoteType): Promise<string> {
		const folderPath = this.getFolderPath(type);

		const existing = this.app.vault.getAbstractFileByPath(folderPath);

		if (!existing) {
			await this.app.vault.createFolder(folderPath);
		}

		return folderPath;
	}
}
