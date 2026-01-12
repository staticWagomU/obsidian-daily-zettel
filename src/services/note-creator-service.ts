import { App, TFile, Notice, moment } from "obsidian";
import { NoteType, NoteMetadata, NOTE_TYPE_CONFIG } from "../types/note-types";
import type { PageZettelSettings } from "../types/settings";
import { FrontmatterService } from "./frontmatter-service";
import { TemplateService } from "./template-service";
import { FolderService } from "./folder-service";
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
}
