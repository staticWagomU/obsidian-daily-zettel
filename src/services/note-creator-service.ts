import { App, TFile, Notice, moment } from "obsidian";
import { NoteType, NoteMetadata, NOTE_TYPE_CONFIG } from "../types/note-types";
import type { PageZettelSettings } from "../types/settings";
import { FrontmatterService } from "./frontmatter-service";
import { TemplateService } from "./template-service";
import { FolderService } from "./folder-service";
import { mergeFrontmatter } from "../utils/frontmatter-parser";
import { t } from "../i18n";

/**
 * ノート作成を統一的に扱うサービス
 * 各ノートタイプの設定に基づいてファイル名形式・フォルダ配置・テンプレート・フロントマターを管理
 */
export class NoteCreatorService {
	private app: App;
	private settings: PageZettelSettings;
	private frontmatterService: FrontmatterService;
	private templateService: TemplateService;
	private folderService: FolderService;

	constructor(
		app: App,
		settings: PageZettelSettings,
		folderService: FolderService,
		templateService: TemplateService,
		frontmatterService: FrontmatterService,
	) {
		this.app = app;
		this.settings = settings;
		this.folderService = folderService;
		this.templateService = templateService;
		this.frontmatterService = frontmatterService;
	}

	/**
	 * ノートを作成
	 * @param type ノートタイプ
	 * @param content ノート本文（オプショナル）
	 * @param inputTitle ユーザー入力タイトル（オプショナル）
	 * @param sourceFile 元ノート（オプショナル）
	 * @returns 作成されたTFile
	 */
	async createNote(
		type: NoteType,
		content?: string,
		inputTitle?: string,
		sourceFile?: TFile,
	): Promise<TFile> {
		// 1. タイトルを決定（inputTitleがある場合はinputTitle、なければタイムスタンプ）
		const title = inputTitle || moment().format("YYYYMMDDHHmmss");

		// 2. フォルダ配置: settings[type].folderから取得+folderService.ensureFolderExistsByPath()
		const folderPath = this.settings[type].folder;
		await this.ensureFolderExistsByPath(folderPath);

		// 3. ファイル名を生成
		const fileName = this.generateFileName(type, title, inputTitle);
		const filePath = `${folderPath}/${fileName}`;

		// 4. テンプレート処理（フロントマター分離）
		const templateResult = await this.templateService.getProcessedTemplateWithFrontmatter(
			type,
			{
				title,
				content: content || "",
				alias: inputTitle,
				date: new Date().toISOString(),
			},
		);

		// 5. デフォルトメタデータ作成
		const defaultMetadata: NoteMetadata = {
			type,
			created: new Date().toISOString(),
			tags: [type],
		};

		// タイトルが入力された場合、フロントマターにtitleを追加
		if (inputTitle) {
			defaultMetadata.title = inputTitle;
		}

		if (sourceFile) {
			defaultMetadata.source_notes = [`[[${sourceFile.basename}]]`];
		}

		// 6. フロントマターマージ（type以外はテンプレート優先）
		const mergedMetadata = mergeFrontmatter(defaultMetadata, templateResult.frontmatter);

		// 7. 最終コンテンツ生成
		const finalContent = this.frontmatterService.addFrontmatter(
			templateResult.body || content || "",
			mergedMetadata,
		);

		// 8. ファイル作成 + Notice通知
		const file = await this.app.vault.create(filePath, finalContent);

		new Notice(t("notices.noteCreated", { icon: NOTE_TYPE_CONFIG[type].icon, title }));

		return file;
	}

	/**
	 * フォルダが存在することを確認し、なければ作成
	 * FolderService.ensureFolderExistsByPath()を直接利用
	 */
	private async ensureFolderExistsByPath(folderPath: string): Promise<void> {
		const existing = this.app.vault.getAbstractFileByPath(folderPath);
		if (existing) {
			return;
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
	 * ファイル名を生成
	 * settings[type].fileNameFormatのプレースホルダーを展開
	 * - {{date}} -> YYYY-MM-DD
	 * - {{time}} -> HH:mm:ss
	 * - {{datetime}} -> YYYY-MM-DD HH:mm:ss
	 * - {{zettel-id}} -> YYYYMMDDHHmmss
	 * - {{title}} -> sanitized title
	 * - {{alias}} -> alias || title
	 */
	private generateFileName(type: NoteType, title: string, alias?: string): string {
		const format = this.settings[type].fileNameFormat;

		// タイトルのサニタイズ
		const sanitizedTitle = title.replace(/[\\/:*?"<>|]/g, "-").trim();

		// プレースホルダーの展開
		let fileName = format;

		// {{date}} -> YYYY-MM-DD
		fileName = fileName.replace(/\{\{date\}\}/g, moment().format("YYYY-MM-DD"));

		// {{time}} -> HH:mm:ss
		fileName = fileName.replace(/\{\{time\}\}/g, moment().format("HH:mm:ss"));

		// {{datetime}} -> YYYY-MM-DD HH:mm:ss
		fileName = fileName.replace(/\{\{datetime\}\}/g, moment().format("YYYY-MM-DD HH:mm:ss"));

		// {{zettel-id}} -> YYYYMMDDHHmmss (ISO形式から変換)
		fileName = fileName.replace(/\{\{zettel-id\}\}/g, moment().format("YYYYMMDDHHmmss"));

		// {{title}} -> sanitized title
		fileName = fileName.replace(/\{\{title\}\}/g, sanitizedTitle);

		// {{alias}} -> alias || title
		fileName = fileName.replace(/\{\{alias\}\}/g, alias || sanitizedTitle);

		// .md拡張子を追加
		return `${fileName}.md`;
	}
}
