import { App, TFile, Notice } from "obsidian";
import { NoteType, NoteMetadata, NOTE_TYPE_CONFIG } from "../types/note-types";
import type { DailyZettelSettings } from "../types/settings";
import { FrontmatterService } from "../services/frontmatter-service";
import { TemplateService } from "../services/template-service";
import { FolderService } from "../services/folder-service";

export interface CreateNoteOptions {
	title: string;
	type: NoteType;
	content?: string;
	sourceFile?: TFile;
	additionalMetadata?: Partial<NoteMetadata>;
}

export class NoteManager {
	private app: App;
	private settings: DailyZettelSettings;
	private frontmatterService: FrontmatterService;
	private templateService: TemplateService;
	private folderService: FolderService;

	constructor(app: App, settings: DailyZettelSettings) {
		this.app = app;
		this.settings = settings;
		this.frontmatterService = new FrontmatterService(app);
		this.templateService = new TemplateService(app, settings);
		this.folderService = new FolderService(app, settings);
	}

	/**
	 * 新規ノートを作成
	 */
	async createNote(options: CreateNoteOptions): Promise<TFile> {
		const { title, type, content = "", sourceFile, additionalMetadata } = options;

		// 1. フォルダを確保
		const folderPath = await this.folderService.ensureFolderExists(type);

		// 2. ファイル名を生成
		const fileName = this.generateFileName(title);
		const filePath = `${folderPath}/${fileName}`;

		// 3. テンプレートを取得・処理
		const templateContent = await this.templateService.getProcessedTemplate(type, {
			title,
			content,
			date: new Date().toISOString(),
		});

		// 4. メタデータを構築
		const metadata: NoteMetadata = {
			type,
			created: new Date().toISOString(),
			tags: [type],
			...additionalMetadata,
		};

		if (sourceFile) {
			metadata.source_notes = [`[[${sourceFile.basename}]]`];
		}

		// 5. フロントマター + コンテンツを結合
		const finalContent = this.frontmatterService.addFrontmatter(
			templateContent || content,
			metadata,
		);

		// 6. ファイル作成
		const file = await this.app.vault.create(filePath, finalContent);

		new Notice(`✅ Created ${NOTE_TYPE_CONFIG[type].icon} ${title}`);

		return file;
	}

	/**
	 * ファイル名を生成
	 */
	private generateFileName(title: string): string {
		const sanitizedTitle = title.replace(/[\\/:*?"<>|]/g, "-").trim();

		switch (this.settings.behavior.fileNamePrefix) {
			case "date": {
				const datePrefix = new Date().toISOString().slice(0, 10);
				return `${datePrefix}-${sanitizedTitle}.md`;
			}
			case "zettel-id": {
				const zettelId = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
				return `${zettelId}-${sanitizedTitle}.md`;
			}
			case "none":
			default:
				return `${sanitizedTitle}.md`;
		}
	}
}
