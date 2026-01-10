import { App } from "obsidian";
import { NoteType, NOTE_TYPE_CONFIG } from "../types/note-types";
import type { PageZettelSettings } from "../types/settings";

export class FolderService {
	private app: App;
	private settings: PageZettelSettings;

	constructor(app: App, settings: PageZettelSettings) {
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
		await this.ensureFolderExistsByPath(folderPath);
		return folderPath;
	}

	/**
	 * 指定パスのフォルダが存在することを確認し、なければ作成
	 * 親フォルダも再帰的に作成する
	 */
	private async ensureFolderExistsByPath(folderPath: string): Promise<void> {
		const existing = this.app.vault.getAbstractFileByPath(folderPath);
		if (existing) {
			return; // 既に存在する
		}

		// 親フォルダを先に作成
		const parentPath = folderPath.split("/").slice(0, -1).join("/");
		if (parentPath) {
			await this.ensureFolderExistsByPath(parentPath);
		}

		// 親フォルダ作成後に再度チェック（競合状態対策）
		const existingAfterParent = this.app.vault.getAbstractFileByPath(folderPath);
		if (!existingAfterParent) {
			try {
				await this.app.vault.createFolder(folderPath);
			} catch {
				// フォルダが既に存在する場合のエラーを無視
			}
		}
	}

	/**
	 * 全ノートタイプとテンプレートフォルダを初期化
	 * プラグイン初回起動時にフォルダ構造を自動生成
	 */
	async initializeAllFolders(): Promise<void> {
		// 全NoteTypeに対してフォルダを作成
		const noteTypes: NoteType[] = ["fleeting", "literature", "permanent", "structure", "index"];

		for (const type of noteTypes) {
			await this.ensureFolderExists(type);
		}

		// テンプレートフォルダを作成
		const templateFolder = this.settings.folders.templateFolder;
		await this.ensureFolderExistsByPath(templateFolder);
	}
}
