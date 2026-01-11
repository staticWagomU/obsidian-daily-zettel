import { App, PluginSettingTab, Setting } from "obsidian";
import PageZettelPlugin from "./main";
import type { PageZettelSettings } from "./types/settings";
import { NOTE_TYPE_CONFIG } from "./types/note-types";
import { FolderSuggest } from "./ui/suggesters/folder-suggest";
import { t } from "./i18n";

export const DEFAULT_SETTINGS: PageZettelSettings = {
	fleeting: {
		folder: NOTE_TYPE_CONFIG.fleeting.folder,
		fileNameFormat: "{{date}}-{{title}}",
		showAliasInput: false,
		templatePath: NOTE_TYPE_CONFIG.fleeting.template,
	},
	literature: {
		folder: NOTE_TYPE_CONFIG.literature.folder,
		fileNameFormat: "{{date}}-{{title}}",
		showAliasInput: true,
		templatePath: NOTE_TYPE_CONFIG.literature.template,
	},
	permanent: {
		folder: NOTE_TYPE_CONFIG.permanent.folder,
		fileNameFormat: "{{zettel-id}}-{{title}}",
		showAliasInput: true,
		templatePath: NOTE_TYPE_CONFIG.permanent.template,
	},
	folders: {
		templateFolder: "Templates",
		dailyNoteFolder: "00-Inbox/Daily",
	},
	behavior: {
		insertLinkAfterExtract: true,
		moveOnPromotion: true,
		fileNamePrefix: "date",
	},
	ui: {
		showEmojiInCommands: true,
		mobileOptimized: true,
		showContextMenuItems: true,
	},
};

export class PageZettelSettingTab extends PluginSettingTab {
	plugin: PageZettelPlugin;

	constructor(app: App, plugin: PageZettelPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		// 共通フォルダ設定セクション
		new Setting(containerEl).setName(t("settings.folders.heading")).setHeading();

		new Setting(containerEl)
			.setName(t("settings.folders.template.name"))
			.setDesc(t("settings.folders.template.desc"))
			.addText((text) => {
				text.setPlaceholder(t("settings.folders.template.placeholder"))
					.setValue(this.plugin.settings.folders.templateFolder)
					.onChange(async (value) => {
						this.plugin.settings.folders.templateFolder = value;
						await this.plugin.saveSettings();
					});
				new FolderSuggest(this.app, text.inputEl);
			});

		new Setting(containerEl)
			.setName(t("settings.folders.dailyNote.name"))
			.setDesc(t("settings.folders.dailyNote.desc"))
			.addText((text) => {
				text.setPlaceholder(t("settings.folders.dailyNote.placeholder"))
					.setValue(this.plugin.settings.folders.dailyNoteFolder)
					.onChange(async (value) => {
						this.plugin.settings.folders.dailyNoteFolder = value;
						await this.plugin.saveSettings();
					});
				new FolderSuggest(this.app, text.inputEl);
			});

		// 動作設定セクション
		new Setting(containerEl).setName(t("settings.behavior.heading")).setHeading();

		new Setting(containerEl)
			.setName(t("settings.behavior.insertLinkAfterExtract.name"))
			.setDesc(t("settings.behavior.insertLinkAfterExtract.desc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.behavior.insertLinkAfterExtract)
					.onChange(async (value) => {
						this.plugin.settings.behavior.insertLinkAfterExtract = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.behavior.moveOnPromotion.name"))
			.setDesc(t("settings.behavior.moveOnPromotion.desc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.behavior.moveOnPromotion)
					.onChange(async (value) => {
						this.plugin.settings.behavior.moveOnPromotion = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.behavior.fileNamePrefix.name"))
			.setDesc(t("settings.behavior.fileNamePrefix.desc"))
			.addDropdown((dropdown) =>
				dropdown
					.addOption("date", t("settings.behavior.fileNamePrefix.options.date"))
					.addOption("zettel-id", t("settings.behavior.fileNamePrefix.options.zettelId"))
					.addOption("none", t("settings.behavior.fileNamePrefix.options.none"))
					.setValue(this.plugin.settings.behavior.fileNamePrefix)
					.onChange(async (value: "date" | "zettel-id" | "none") => {
						this.plugin.settings.behavior.fileNamePrefix = value;
						await this.plugin.saveSettings();
					}),
			);

		// UI設定セクション
		new Setting(containerEl).setName(t("settings.ui.heading")).setHeading();

		new Setting(containerEl)
			.setName(t("settings.ui.showEmojiInCommands.name"))
			.setDesc(t("settings.ui.showEmojiInCommands.desc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.ui.showEmojiInCommands)
					.onChange(async (value) => {
						this.plugin.settings.ui.showEmojiInCommands = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.ui.showContextMenuItems.name"))
			.setDesc(t("settings.ui.showContextMenuItems.desc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.ui.showContextMenuItems)
					.onChange(async (value) => {
						this.plugin.settings.ui.showContextMenuItems = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
