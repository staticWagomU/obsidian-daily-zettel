import { App, PluginSettingTab, Setting } from "obsidian";
import DailyZettelPlugin from "./main";
import type { DailyZettelSettings } from "./types/settings";
import { NOTE_TYPE_CONFIG } from "./types/note-types";

export const DEFAULT_SETTINGS: DailyZettelSettings = {
	folders: {
		typeFolders: {
			fleeting: NOTE_TYPE_CONFIG.fleeting.folder,
			literature: NOTE_TYPE_CONFIG.literature.folder,
			permanent: NOTE_TYPE_CONFIG.permanent.folder,
			structure: NOTE_TYPE_CONFIG.structure.folder,
			index: NOTE_TYPE_CONFIG.index.folder,
		},
		templateFolder: "Templates",
		dailyNoteFolder: "00-Inbox/Daily",
	},
	behavior: {
		insertLinkAfterExtract: true,
		suggestStructureOnPermanent: true,
		moveOnPromotion: true,
		fileNamePrefix: "date",
	},
	ui: {
		showEmojiInCommands: true,
		mobileOptimized: true,
	},
};

export class DailyZettelSettingTab extends PluginSettingTab {
	plugin: DailyZettelPlugin;

	constructor(app: App, plugin: DailyZettelPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		// フォルダ設定セクション
		new Setting(containerEl).setName("フォルダ設定").setHeading();

		new Setting(containerEl)
			.setName("Fleetingノートフォルダ")
			.setDesc("一時的なアイデアを保存するフォルダ")
			.addText((text) =>
				text
					.setPlaceholder("00-inbox/fleeting")
					.setValue(this.plugin.settings.folders.typeFolders.fleeting)
					.onChange(async (value) => {
						this.plugin.settings.folders.typeFolders.fleeting = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Literatureノートフォルダ")
			.setDesc("文献メモを保存するフォルダ")
			.addText((text) =>
				text
					.setPlaceholder("10-literature")
					.setValue(this.plugin.settings.folders.typeFolders.literature)
					.onChange(async (value) => {
						this.plugin.settings.folders.typeFolders.literature = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Permanentノートフォルダ")
			.setDesc("永続的な知識を保存するフォルダ")
			.addText((text) =>
				text
					.setPlaceholder("20-permanent")
					.setValue(this.plugin.settings.folders.typeFolders.permanent)
					.onChange(async (value) => {
						this.plugin.settings.folders.typeFolders.permanent = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Structureノートフォルダ")
			.setDesc("構造ノートを保存するフォルダ")
			.addText((text) =>
				text
					.setPlaceholder("30-structure")
					.setValue(this.plugin.settings.folders.typeFolders.structure)
					.onChange(async (value) => {
						this.plugin.settings.folders.typeFolders.structure = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Indexノートフォルダ")
			.setDesc("インデックスノートを保存するフォルダ")
			.addText((text) =>
				text
					.setPlaceholder("40-index")
					.setValue(this.plugin.settings.folders.typeFolders.index)
					.onChange(async (value) => {
						this.plugin.settings.folders.typeFolders.index = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("テンプレートフォルダ")
			.setDesc("ノート作成時に使用するテンプレートを保存するフォルダ")
			.addText((text) =>
				text
					.setPlaceholder("Templates")
					.setValue(this.plugin.settings.folders.templateFolder)
					.onChange(async (value) => {
						this.plugin.settings.folders.templateFolder = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("デイリーノートフォルダ")
			.setDesc("デイリーノートを保存するフォルダ")
			.addText((text) =>
				text
					.setPlaceholder("00-inbox/daily")
					.setValue(this.plugin.settings.folders.dailyNoteFolder)
					.onChange(async (value) => {
						this.plugin.settings.folders.dailyNoteFolder = value;
						await this.plugin.saveSettings();
					}),
			);

		// 動作設定セクション
		new Setting(containerEl).setName("動作設定").setHeading();

		new Setting(containerEl)
			.setName("切り出し後にリンクを挿入")
			.setDesc("選択範囲から新規ノート作成後、元ノートに新規ノートへのリンクを挿入します")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.behavior.insertLinkAfterExtract)
					.onChange(async (value) => {
						this.plugin.settings.behavior.insertLinkAfterExtract = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Permanentノート作成時にstructure提案")
			.setDesc("Permanentノート作成時に関連するstructureノートへの接続を提案します")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.behavior.suggestStructureOnPermanent)
					.onChange(async (value) => {
						this.plugin.settings.behavior.suggestStructureOnPermanent = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("昇格時にフォルダ移動")
			.setDesc("ノート昇格時に自動的に対応するフォルダに移動します")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.behavior.moveOnPromotion)
					.onChange(async (value) => {
						this.plugin.settings.behavior.moveOnPromotion = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("ファイル名プレフィックス")
			.setDesc("新規ノート作成時のファイル名のプレフィックス形式を選択します")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("date", "日付形式 (yyyymmdd)")
					.addOption("zettel-id", "Zettelkasten ID形式 (yyyymmddhhmm)")
					.addOption("none", "なし")
					.setValue(this.plugin.settings.behavior.fileNamePrefix)
					.onChange(async (value: "date" | "zettel-id" | "none") => {
						this.plugin.settings.behavior.fileNamePrefix = value;
						await this.plugin.saveSettings();
					}),
			);

		// UI設定セクション
		new Setting(containerEl).setName("UI設定").setHeading();

		new Setting(containerEl)
			.setName("コマンドに絵文字を表示")
			.setDesc("コマンドパレットに表示されるコマンド名に絵文字を含めます")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.ui.showEmojiInCommands)
					.onChange(async (value) => {
						this.plugin.settings.ui.showEmojiInCommands = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
