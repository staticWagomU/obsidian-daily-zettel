import { setIcon } from "obsidian";
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

		// Create FAB container with position class
		this.containerEl = document.body.createDiv({
			cls: this.getContainerClasses(),
		});

		// Create FAB button
		const button = this.containerEl.createEl("button", {
			cls: "page-zettel-fab-button",
			attr: {
				"aria-label": "Quick add fleeting note",
			},
		});

		// Add icon using Obsidian's setIcon API
		setIcon(button, "zap");

		// Click event
		button.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.onClick();
		});
	}

	/**
	 * コンテナのCSSクラスを取得
	 */
	private getContainerClasses(): string[] {
		const classes = ["page-zettel-quick-add-widget"];
		const position = this.settings.ui.quickAddWidgetPosition;

		if (position === "bottom-left") {
			classes.push("position-bottom-left");
		} else {
			classes.push("position-bottom-right");
		}

		return classes;
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
			this.applyPositionClasses();
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
	 * 位置クラスを適用
	 */
	private applyPositionClasses(): void {
		if (!this.containerEl) return;

		const position = this.settings.ui.quickAddWidgetPosition;

		// Remove existing position classes
		this.containerEl.removeClass("position-bottom-right", "position-bottom-left");

		// Apply new position class
		if (position === "bottom-left") {
			this.containerEl.addClass("position-bottom-left");
		} else {
			this.containerEl.addClass("position-bottom-right");
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
		if (
			this.settings.ui.quickAddWidgetPosition === "bottom-right" &&
			!isRightSidebarCollapsed
		) {
			this.containerEl.addClass("is-hidden");
		} else {
			this.containerEl.removeClass("is-hidden");
		}
	}
}
