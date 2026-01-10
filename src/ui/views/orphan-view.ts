import { ItemView, WorkspaceLeaf, TFile, Notice } from "obsidian";
import { OrphanDetectorService } from "../../services/orphan-detector-service";
import { StructureSuggestModal } from "../modals/structure-suggest-modal";
import { ConnectionManager } from "../../core/connection-manager";
import type { PageZettelSettings } from "../../types/settings";
import type { OrphanStats } from "../../types";
import { t } from "../../i18n";

export const VIEW_TYPE_ORPHAN = "orphan-permanent-view";

export class OrphanView extends ItemView {
	private orphanDetectorService: OrphanDetectorService;
	private connectionManager: ConnectionManager;
	private orphanNotes: TFile[] = [];
	private orphanStats: OrphanStats | null = null;
	private settings: PageZettelSettings;

	constructor(leaf: WorkspaceLeaf, settings: PageZettelSettings) {
		super(leaf);
		this.settings = settings;
		this.orphanDetectorService = new OrphanDetectorService(this.app);
		this.connectionManager = new ConnectionManager(this.app);
	}

	getViewType(): string {
		return VIEW_TYPE_ORPHAN;
	}

	getDisplayText(): string {
		return t("views.orphan.title");
	}

	getIcon(): string {
		return "unlink";
	}

	async onOpen(): Promise<void> {
		await this.refresh();
	}

	async onClose(): Promise<void> {
		// Clean up if needed
	}

	/**
	 * ビューをリフレッシュして孤立ノートと統計情報を再取得
	 */
	async refresh(): Promise<void> {
		this.orphanNotes = await this.orphanDetectorService.getOrphanPermanentNotes();
		this.orphanStats = await this.orphanDetectorService.getStats();
		this.renderView();
	}

	/**
	 * ノートをStructure Noteに接続
	 */
	private connectNote(note: TFile): void {
		const modal = new StructureSuggestModal(
			this.app,
			this.settings,
			note,
			(structureFile: TFile | null) => {
				void (async () => {
					if (structureFile) {
						await this.connectionManager.linkPermanentToStructure(note, structureFile);
						new Notice(t("notices.linkSuccess", { name: structureFile.basename }));
						// ビューを自動更新（接続されたノートはリストから削除される）
						await this.refresh();
					}
				})();
			},
		);

		modal.open();
	}

	/**
	 * ビューのコンテンツを描画
	 */
	private renderView(): void {
		const container = this.containerEl.children[1];
		if (!container) {
			return;
		}
		container.empty();
		container.addClass("orphan-view-container");

		// ヘッダーとリフレッシュボタン
		const header = container.createDiv({ cls: "orphan-view-header" });
		header.createEl("h4", { text: t("views.orphan.title") });

		// 統計情報を表示
		if (this.orphanStats) {
			const statsText = t("views.orphan.stats", {
				rate: this.orphanStats.connectionRate.toFixed(1),
				orphans: String(this.orphanStats.orphans),
				total: String(this.orphanStats.total),
			});
			header.createDiv({
				text: statsText,
				cls: "orphan-view-stats",
			});
		}

		const refreshButton = header.createEl("button", {
			text: t("views.orphan.refreshButton"),
			cls: "orphan-view-refresh-button",
		});
		refreshButton.addEventListener("click", () => {
			void this.refresh();
		});

		// 孤立ノートリスト
		if (this.orphanNotes.length === 0) {
			container.createDiv({
				text: t("views.orphan.emptyMessage"),
				cls: "orphan-view-empty",
			});
		} else {
			const listContainer = container.createDiv({ cls: "orphan-view-list" });

			for (const note of this.orphanNotes) {
				const item = listContainer.createDiv({ cls: "orphan-view-item" });

				const link = item.createEl("a", {
					text: note.basename,
					cls: "orphan-view-note-link",
				});

				link.addEventListener("click", (e) => {
					e.preventDefault();
					void this.app.workspace.getLeaf(false).openFile(note);
				});

				// 接続ボタン
				const connectButton = item.createEl("button", {
					text: t("views.orphan.connectButton"),
					cls: "orphan-view-connect-button",
				});

				connectButton.addEventListener("click", () => {
					this.connectNote(note);
				});
			}
		}
	}
}
