import { App, Modal, Setting } from "obsidian";
import type PageZettelPlugin from "../../main";
import { t } from "../../i18n";

export interface TitleInputResult {
	title: string;
	removeIndent: boolean;
}

export class TitleInputModal extends Modal {
	private plugin: PageZettelPlugin;
	private onSubmit: (result: TitleInputResult) => void;
	private titleInput: HTMLInputElement | null = null;
	private showRemoveIndent: boolean;
	private removeIndentValue = false;

	constructor(
		app: App,
		plugin: PageZettelPlugin,
		onSubmit: (result: TitleInputResult) => void,
		showRemoveIndent = false,
	) {
		super(app);
		this.plugin = plugin;
		this.onSubmit = onSubmit;
		this.showRemoveIndent = showRemoveIndent;
	}

	onOpen(): void {
		const { contentEl } = this;

		contentEl.empty();
		contentEl.addClass("page-zettel-modal");

		// モーダルタイトル
		contentEl.createEl("h2", { text: t("modals.titleInput.title") });

		// タイトル入力
		new Setting(contentEl)
			.setName(t("modals.titleInput.inputName"))
			.setDesc(t("modals.titleInput.inputDesc"))
			.addText((text) => {
				this.titleInput = text.inputEl;
				text.setPlaceholder(t("modals.titleInput.inputPlaceholder"))
					.onChange(() => {
						// 入力値の変更を監視
					})
					.inputEl.addEventListener("keydown", (event: KeyboardEvent) => {
						if (event.key === "Enter" && !event.shiftKey) {
							event.preventDefault();
							this.handleSubmit();
						} else if (event.key === "Escape") {
							event.preventDefault();
							this.close();
						}
					});

				// モーダルが開いたときにフォーカス
				setTimeout(() => {
					this.titleInput?.focus();
				}, 10);
			});

		// チェックボックス（Extract時のみ表示）
		if (this.showRemoveIndent) {
			new Setting(contentEl)
				.setName(t("modals.titleInput.removeIndent"))
				.addToggle((toggle) => {
					toggle.setValue(this.removeIndentValue).onChange((value) => {
						this.removeIndentValue = value;
					});
				});
		}

		// ボタン
		new Setting(contentEl)
			.addButton((btn) =>
				btn
					.setButtonText(t("modals.titleInput.createButton"))
					.setCta()
					.onClick(() => {
						this.handleSubmit();
					}),
			)
			.addButton((btn) =>
				btn.setButtonText(t("modals.titleInput.cancelButton")).onClick(() => {
					this.close();
				}),
			);
	}

	onClose(): void {
		const { contentEl } = this;
		contentEl.empty();
	}

	private handleSubmit(): void {
		const title = this.titleInput?.value.trim() || "";

		this.onSubmit({
			title,
			removeIndent: this.removeIndentValue,
		});
		this.close();
	}
}
