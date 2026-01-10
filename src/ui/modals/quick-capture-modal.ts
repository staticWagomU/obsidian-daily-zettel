import { App, Modal, Setting } from "obsidian";
import type DailyZettelPlugin from "../../main";

export class QuickCaptureModal extends Modal {
	private plugin: DailyZettelPlugin;
	private onSubmit: (title: string) => void;
	private titleInput: HTMLInputElement | null = null;

	constructor(app: App, plugin: DailyZettelPlugin, onSubmit: (title: string) => void) {
		super(app);
		this.plugin = plugin;
		this.onSubmit = onSubmit;
	}

	onOpen(): void {
		const { contentEl } = this;

		contentEl.empty();
		contentEl.addClass("daily-zettel-modal");

		// モーダルタイトル
		contentEl.createEl("h2", { text: "Quick fleeting note" });

		// テキストエリア設定
		new Setting(contentEl)
			.setName("Title")
			.setDesc("Enter your fleeting note title.")
			.addText((text) => {
				this.titleInput = text.inputEl;
				text.setPlaceholder("Enter title...")
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
					.setButtonText("Create")
					.setCta()
					.onClick(() => {
						this.handleSubmit();
					}),
			)
			.addButton((btn) =>
				btn.setButtonText("Cancel").onClick(() => {
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
