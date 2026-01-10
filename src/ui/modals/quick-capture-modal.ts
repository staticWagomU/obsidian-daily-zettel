import { App, Modal, Setting } from "obsidian";
import type PageZettelPlugin from "../../main";
import { t } from "../../i18n";

export class QuickCaptureModal extends Modal {
	private plugin: PageZettelPlugin;
	private onSubmit: (title: string) => void;
	private titleInput: HTMLInputElement | null = null;

	constructor(app: App, plugin: PageZettelPlugin, onSubmit: (title: string) => void) {
		super(app);
		this.plugin = plugin;
		this.onSubmit = onSubmit;
	}

	onOpen(): void {
		const { contentEl } = this;

		contentEl.empty();
		contentEl.addClass("page-zettel-modal");

		// モーダルタイトル
		contentEl.createEl("h2", { text: t("modals.quickCapture.title") });

		// テキストエリア設定
		new Setting(contentEl)
			.setName(t("modals.quickCapture.inputName"))
			.setDesc(t("modals.quickCapture.inputDesc"))
			.addText((text) => {
				this.titleInput = text.inputEl;
				text.setPlaceholder(t("modals.quickCapture.inputPlaceholder"))
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

		// ボタン
		new Setting(contentEl)
			.addButton((btn) =>
				btn
					.setButtonText(t("modals.quickCapture.createButton"))
					.setCta()
					.onClick(() => {
						this.handleSubmit();
					}),
			)
			.addButton((btn) =>
				btn.setButtonText(t("modals.quickCapture.cancelButton")).onClick(() => {
					this.close();
				}),
			);
	}

	onClose(): void {
		const { contentEl } = this;
		contentEl.empty();
	}

	private handleSubmit(): void {
		const title = this.titleInput?.value.trim();
		if (!title) {
			return;
		}

		this.onSubmit(title);
		this.close();
	}
}
