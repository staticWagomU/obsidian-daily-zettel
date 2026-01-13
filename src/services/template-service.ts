import { App, moment, TFile } from "obsidian";
import type { NoteType } from "../types/note-types";
import type { PageZettelSettings } from "../types/settings";

export interface TemplateVariables {
	title: string;
	content?: string;
	date: string;
	alias?: string;
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
		const templatePath = this.settings[type].templatePath;

		// テンプレートパスが未設定の場合
		if (!templatePath) {
			return null;
		}

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

		// {{alias}} の展開
		result = result.replace(/\{\{alias\}\}/g, variables.alias || "");

		// {{date:FORMAT}} の展開（カスタムフォーマット）
		result = result.replace(/\{\{date:([^}]+)\}\}/g, (match: string, format: string) => {
			try {
				return moment(variables.date).format(format);
			} catch {
				return match; // フォーマット失敗時は元の文字列を返す
			}
		});

		// {{date}} の展開（固定形式: YYYY-MM-DD）
		result = result.replace(/\{\{date\}\}/g, moment().format("YYYY-MM-DD"));

		// {{time}} の展開（固定形式: HH:mm:ss）
		result = result.replace(/\{\{time\}\}/g, moment().format("HH:mm:ss"));

		// {{datetime}} の展開（固定形式: YYYY-MM-DD HH:mm:ss）
		result = result.replace(/\{\{datetime\}\}/g, moment().format("YYYY-MM-DD HH:mm:ss"));

		return result;
	}
}
