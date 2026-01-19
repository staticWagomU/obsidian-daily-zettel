import { App, PluginSettingTab, Setting } from "obsidian";
import PageZettelPlugin from "./main";
import type { PageZettelSettings } from "./types/settings";
import type { NoteType } from "./types/note-types";
import { FolderSuggest } from "./ui/suggesters/folder-suggest";
import { FileSuggest } from "./ui/suggesters/file-suggest";
import { EmojiSuggest } from "./ui/suggesters/emoji-suggest";
import { getDefaultFrontmatterPreview } from "./utils/frontmatter-parser";
import { t } from "./i18n";

export const DEFAULT_SETTINGS: PageZettelSettings = {
	fleeting: {
		folder: "",
		fileNameFormat: "{{date}}-{{title}}",
		showAliasInput: false,
		templatePath: "",
		icon: "💭",
	},
	literature: {
		folder: "",
		fileNameFormat: "{{date}}-{{title}}",
		showAliasInput: true,
		templatePath: "",
		icon: "📚",
	},
	permanent: {
		folder: "",
		fileNameFormat: "{{zettel-id}}-{{title}}",
		showAliasInput: true,
		templatePath: "",
		icon: "💎",
	},
	behavior: {
		insertLinkAfterExtract: true,
		openAfterExtract: true,
		moveOnPromotion: true,
		fileNamePrefix: "date",
	},
	ui: {
		showEmojiInCommands: true,
		mobileOptimized: true,
		showContextMenuItems: true,
		showQuickAddWidget: true,
		quickAddWidgetPosition: "bottom-right",
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

		// Fleeting設定セクション
		new Setting(containerEl).setName(t("settings.noteTypes.fleeting.heading")).setHeading();

		new Setting(containerEl)
			.setName(t("settings.noteTypes.fleeting.folder.name"))
			.setDesc(t("settings.noteTypes.fleeting.folder.desc"))
			.addText((text) => {
				text.setPlaceholder(t("settings.noteTypes.fleeting.folder.placeholder"))
					.setValue(this.plugin.settings.fleeting.folder)
					.onChange(async (value) => {
						this.plugin.settings.fleeting.folder = value;
						await this.plugin.saveSettings();
					});
				new FolderSuggest(this.app, text.inputEl);
			});

		new Setting(containerEl)
			.setName(t("settings.noteTypes.fleeting.fileNameFormat.name"))
			.setDesc(t("settings.noteTypes.fleeting.fileNameFormat.desc"))
			.addText((text) =>
				text
					.setPlaceholder(t("settings.noteTypes.fleeting.fileNameFormat.placeholder"))
					.setValue(this.plugin.settings.fleeting.fileNameFormat)
					.onChange(async (value) => {
						this.plugin.settings.fleeting.fileNameFormat = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.noteTypes.fleeting.showAliasInput.name"))
			.setDesc(t("settings.noteTypes.fleeting.showAliasInput.desc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.fleeting.showAliasInput)
					.onChange(async (value) => {
						this.plugin.settings.fleeting.showAliasInput = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.noteTypes.fleeting.templatePath.name"))
			.setDesc(t("settings.noteTypes.fleeting.templatePath.desc"))
			.addText((text) => {
				text.setPlaceholder(t("settings.noteTypes.fleeting.templatePath.placeholder"))
					.setValue(this.plugin.settings.fleeting.templatePath)
					.onChange(async (value) => {
						this.plugin.settings.fleeting.templatePath = value;
						await this.plugin.saveSettings();
					});
				new FileSuggest(this.app, text.inputEl);
			});

		new Setting(containerEl)
			.setName(t("settings.noteTypes.fleeting.icon.name"))
			.setDesc(t("settings.noteTypes.fleeting.icon.desc"))
			.addText((text) => {
				text.setPlaceholder(t("settings.noteTypes.fleeting.icon.placeholder"))
					.setValue(this.plugin.settings.fleeting.icon)
					.onChange(async (value) => {
						this.plugin.settings.fleeting.icon = value;
						await this.plugin.saveSettings();
					});
				text.inputEl.addClass("page-zettel-icon-input");
				new EmojiSuggest(this.app, text.inputEl);
			});

		this.addFrontmatterPreview(containerEl, "fleeting");

		// Literature設定セクション
		new Setting(containerEl).setName(t("settings.noteTypes.literature.heading")).setHeading();

		new Setting(containerEl)
			.setName(t("settings.noteTypes.literature.folder.name"))
			.setDesc(t("settings.noteTypes.literature.folder.desc"))
			.addText((text) => {
				text.setPlaceholder(t("settings.noteTypes.literature.folder.placeholder"))
					.setValue(this.plugin.settings.literature.folder)
					.onChange(async (value) => {
						this.plugin.settings.literature.folder = value;
						await this.plugin.saveSettings();
					});
				new FolderSuggest(this.app, text.inputEl);
			});

		new Setting(containerEl)
			.setName(t("settings.noteTypes.literature.fileNameFormat.name"))
			.setDesc(t("settings.noteTypes.literature.fileNameFormat.desc"))
			.addText((text) =>
				text
					.setPlaceholder(t("settings.noteTypes.literature.fileNameFormat.placeholder"))
					.setValue(this.plugin.settings.literature.fileNameFormat)
					.onChange(async (value) => {
						this.plugin.settings.literature.fileNameFormat = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.noteTypes.literature.showAliasInput.name"))
			.setDesc(t("settings.noteTypes.literature.showAliasInput.desc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.literature.showAliasInput)
					.onChange(async (value) => {
						this.plugin.settings.literature.showAliasInput = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.noteTypes.literature.templatePath.name"))
			.setDesc(t("settings.noteTypes.literature.templatePath.desc"))
			.addText((text) => {
				text.setPlaceholder(t("settings.noteTypes.literature.templatePath.placeholder"))
					.setValue(this.plugin.settings.literature.templatePath)
					.onChange(async (value) => {
						this.plugin.settings.literature.templatePath = value;
						await this.plugin.saveSettings();
					});
				new FileSuggest(this.app, text.inputEl);
			});

		new Setting(containerEl)
			.setName(t("settings.noteTypes.literature.icon.name"))
			.setDesc(t("settings.noteTypes.literature.icon.desc"))
			.addText((text) => {
				text.setPlaceholder(t("settings.noteTypes.literature.icon.placeholder"))
					.setValue(this.plugin.settings.literature.icon)
					.onChange(async (value) => {
						this.plugin.settings.literature.icon = value;
						await this.plugin.saveSettings();
					});
				text.inputEl.addClass("page-zettel-icon-input");
				new EmojiSuggest(this.app, text.inputEl);
			});

		this.addFrontmatterPreview(containerEl, "literature");

		// Permanent設定セクション
		new Setting(containerEl).setName(t("settings.noteTypes.permanent.heading")).setHeading();

		new Setting(containerEl)
			.setName(t("settings.noteTypes.permanent.folder.name"))
			.setDesc(t("settings.noteTypes.permanent.folder.desc"))
			.addText((text) => {
				text.setPlaceholder(t("settings.noteTypes.permanent.folder.placeholder"))
					.setValue(this.plugin.settings.permanent.folder)
					.onChange(async (value) => {
						this.plugin.settings.permanent.folder = value;
						await this.plugin.saveSettings();
					});
				new FolderSuggest(this.app, text.inputEl);
			});

		new Setting(containerEl)
			.setName(t("settings.noteTypes.permanent.fileNameFormat.name"))
			.setDesc(t("settings.noteTypes.permanent.fileNameFormat.desc"))
			.addText((text) =>
				text
					.setPlaceholder(t("settings.noteTypes.permanent.fileNameFormat.placeholder"))
					.setValue(this.plugin.settings.permanent.fileNameFormat)
					.onChange(async (value) => {
						this.plugin.settings.permanent.fileNameFormat = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.noteTypes.permanent.showAliasInput.name"))
			.setDesc(t("settings.noteTypes.permanent.showAliasInput.desc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.permanent.showAliasInput)
					.onChange(async (value) => {
						this.plugin.settings.permanent.showAliasInput = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.noteTypes.permanent.templatePath.name"))
			.setDesc(t("settings.noteTypes.permanent.templatePath.desc"))
			.addText((text) => {
				text.setPlaceholder(t("settings.noteTypes.permanent.templatePath.placeholder"))
					.setValue(this.plugin.settings.permanent.templatePath)
					.onChange(async (value) => {
						this.plugin.settings.permanent.templatePath = value;
						await this.plugin.saveSettings();
					});
				new FileSuggest(this.app, text.inputEl);
			});

		new Setting(containerEl)
			.setName(t("settings.noteTypes.permanent.icon.name"))
			.setDesc(t("settings.noteTypes.permanent.icon.desc"))
			.addText((text) => {
				text.setPlaceholder(t("settings.noteTypes.permanent.icon.placeholder"))
					.setValue(this.plugin.settings.permanent.icon)
					.onChange(async (value) => {
						this.plugin.settings.permanent.icon = value;
						await this.plugin.saveSettings();
					});
				text.inputEl.addClass("page-zettel-icon-input");
				new EmojiSuggest(this.app, text.inputEl);
			});

		this.addFrontmatterPreview(containerEl, "permanent");

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
			.setName(t("settings.behavior.openAfterExtract.name"))
			.setDesc(t("settings.behavior.openAfterExtract.desc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.behavior.openAfterExtract)
					.onChange(async (value) => {
						this.plugin.settings.behavior.openAfterExtract = value;
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

		new Setting(containerEl)
			.setName(t("settings.ui.showQuickAddWidget.name"))
			.setDesc(t("settings.ui.showQuickAddWidget.desc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.ui.showQuickAddWidget)
					.onChange(async (value) => {
						this.plugin.settings.ui.showQuickAddWidget = value;
						await this.plugin.saveSettings();
						this.plugin.updateQuickAddWidget();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.ui.quickAddWidgetPosition.name"))
			.setDesc(t("settings.ui.quickAddWidgetPosition.desc"))
			.addDropdown((dropdown) =>
				dropdown
					.addOption(
						"bottom-right",
						t("settings.ui.quickAddWidgetPositionOptions.bottomRight"),
					)
					.addOption(
						"bottom-left",
						t("settings.ui.quickAddWidgetPositionOptions.bottomLeft"),
					)
					.setValue(this.plugin.settings.ui.quickAddWidgetPosition)
					.onChange(async (value: "bottom-right" | "bottom-left") => {
						this.plugin.settings.ui.quickAddWidgetPosition = value;
						await this.plugin.saveSettings();
						this.plugin.updateQuickAddWidget();
					}),
			);
	}

	/**
	 * デフォルトフロントマターのプレビューを追加
	 */
	private addFrontmatterPreview(containerEl: HTMLElement, type: NoteType): void {
		const setting = new Setting(containerEl)
			.setName(t(`settings.noteTypes.${type}.defaultFrontmatter.name`))
			.setDesc(t(`settings.noteTypes.${type}.defaultFrontmatter.desc`));

		const previewEl = setting.settingEl.createDiv({
			cls: "page-zettel-frontmatter-preview",
		});
		previewEl.createEl("pre").createEl("code", {
			text: getDefaultFrontmatterPreview(type),
		});
	}
}
