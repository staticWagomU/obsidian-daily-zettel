import { App, moment, TFile } from "obsidian";
import { NoteType, NOTE_TYPE_CONFIG } from "../types/note-types";
import type { PageZettelSettings } from "../types/settings";

export interface TemplateVariables {
	title: string;
	content?: string;
	date: string;
	[key: string]: string | undefined;
}

export class TemplateService {
	private app: App;
	private settings: PageZettelSettings;

	constructor(app: App, settings: PageZettelSettings) {
		this.app = app;
		this.settings = settings;
	}

	/**
	 * テンプレートを取得して変数を展開
	 */
	async getProcessedTemplate(type: NoteType, variables: TemplateVariables): Promise<string> {
		// 1. テンプレートファイルを読み込み
		const templateContent = await this.loadTemplate(type);

		// 2. テンプレートが存在しない場合はcontentをフォールバック
		if (!templateContent) {
			return variables.content || "";
		}

		// 3. 変数を展開
		return this.expandVariables(templateContent, variables);
	}

	/**
	 * テンプレートファイルを読み込む
	 */
	private async loadTemplate(type: NoteType): Promise<string | null> {
		const templateFolder = this.settings.folders.templateFolder;
		const templateFileName = NOTE_TYPE_CONFIG[type].template;
		const templatePath = `${templateFolder}/${templateFileName}`;

		try {
			const file = this.app.vault.getAbstractFileByPath(templatePath);
			if (!file) {
				return null;
			}

			// TFileかどうかチェック
			if (!(file instanceof TFile)) {
				return null;
			}

			const content = await this.app.vault.read(file);
			return content;
		} catch {
			return null;
		}
	}

	/**
	 * テンプレート内の変数を展開
	 */
	private expandVariables(template: string, variables: TemplateVariables): string {
		let result = template;

		// {{title}} の展開
		result = result.replace(/\{\{title\}\}/g, variables.title);

		// {{content}} の展開
		result = result.replace(/\{\{content\}\}/g, variables.content || "");

		// {{date:FORMAT}} の展開
		result = result.replace(/\{\{date:([^}]+)\}\}/g, (match: string, format: string) => {
			try {
				return moment(variables.date).format(format);
			} catch {
				return match; // フォーマット失敗時は元の文字列を返す
			}
		});

		return result;
	}
}
