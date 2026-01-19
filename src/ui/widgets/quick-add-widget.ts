import type { App, Workspace } from "obsidian";
import type { PageZettelSettings } from "../../types/settings";

/**
 * Quick Add Widget (Floating Action Button)
 * モバイルユーザーが素早くFleeting Noteを作成できるFABコンポーネント
 */
export class QuickAddWidget {
	private app: App;
	private settings: PageZettelSettings;
	private containerEl: HTMLElement | null = null;
	private onClick: () => void;

	constructor(app: App, settings: PageZettelSettings, onClick: () => void) {
		this.app = app;
		this.settings = settings;
		this.onClick = onClick;
	}

	/**
	 * ウィジェットを表示
	 */
	show(): void {
		if (this.containerEl) {
			return; // Already visible
		}

		// Create FAB container
		this.containerEl = document.body.createDiv({
			cls: "page-zettel-quick-add-widget",
		});

		// Apply position styles
		this.applyPositionStyles();

		// Create FAB button
		const button = this.containerEl.createEl("button", {
			cls: "page-zettel-fab-button",
			attr: {
				"aria-label": "Quick Add Fleeting Note",
			},
		});

		// Add icon (lightning bolt for quick action)
		button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;

		// Click event
		button.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.onClick();
		});

		// Apply styles
		this.applyStyles();
	}

	/**
	 * ウィジェットを非表示
	 */
	hide(): void {
		if (this.containerEl) {
			this.containerEl.remove();
			this.containerEl = null;
		}
	}

	/**
	 * ウィジェットを削除
	 */
	remove(): void {
		this.hide();
	}

	/**
	 * 設定更新時にウィジェットを再描画
	 */
	updateSettings(settings: PageZettelSettings): void {
		this.settings = settings;
		if (this.containerEl) {
			this.applyPositionStyles();
		}
	}

	/**
	 * 表示/非表示を切り替え
	 */
	toggle(visible: boolean): void {
		if (visible) {
			this.show();
		} else {
			this.hide();
		}
	}

	/**
	 * 位置スタイルを適用
	 */
	private applyPositionStyles(): void {
		if (!this.containerEl) return;

		const position = this.settings.ui.quickAddWidgetPosition;

		// Reset position styles
		this.containerEl.style.left = "";
		this.containerEl.style.right = "";

		// Apply position based on setting
		if (position === "bottom-left") {
			this.containerEl.style.left = "20px";
		} else {
			// Default: bottom-right
			this.containerEl.style.right = "20px";
		}
	}

	/**
	 * CSSスタイルを適用（インラインスタイル + CSS変数を使用）
	 */
	private applyStyles(): void {
		if (!this.containerEl) return;

		// Container styles
		Object.assign(this.containerEl.style, {
			position: "fixed",
			bottom: "20px",
			zIndex: "1000",
		});

		// Button styles
		const button = this.containerEl.querySelector(".page-zettel-fab-button") as HTMLElement;
		if (button) {
			Object.assign(button.style, {
				width: "56px",
				height: "56px",
				borderRadius: "50%",
				border: "none",
				backgroundColor: "var(--interactive-accent)",
				color: "var(--text-on-accent)",
				cursor: "pointer",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
				transition: "transform 0.2s ease, box-shadow 0.2s ease",
			});

			// Hover effect
			button.addEventListener("mouseenter", () => {
				button.style.transform = "scale(1.1)";
				button.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.4)";
			});

			button.addEventListener("mouseleave", () => {
				button.style.transform = "scale(1)";
				button.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
			});

			// Active effect
			button.addEventListener("mousedown", () => {
				button.style.transform = "scale(0.95)";
			});

			button.addEventListener("mouseup", () => {
				button.style.transform = "scale(1.1)";
			});
		}
	}

	/**
	 * サイドバー展開状態を考慮した表示制御
	 */
	handleLayoutChange(workspace: Workspace): void {
		if (!this.containerEl) return;

		// Check if right sidebar is expanded
		const rightSplit = workspace.rightSplit;
		const isRightSidebarCollapsed = rightSplit?.collapsed ?? true;

		// Hide FAB when right sidebar is expanded (only for bottom-right position)
		if (this.settings.ui.quickAddWidgetPosition === "bottom-right" && !isRightSidebarCollapsed) {
			this.containerEl.style.display = "none";
		} else {
			this.containerEl.style.display = "";
		}
	}
}
