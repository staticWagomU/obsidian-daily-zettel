import { ItemView, WorkspaceLeaf, TFile, Notice } from "obsidian";
import { OrphanDetectorService } from "../../services/orphan-detector-service";
import { StructureSuggestModal } from "../modals/structure-suggest-modal";
import { ConnectionManager } from "../../core/connection-manager";
import type { DailyZettelSettings } from "../../types/settings";

export const VIEW_TYPE_ORPHAN = "orphan-permanent-view";

export class OrphanView extends ItemView {
	private orphanDetectorService: OrphanDetectorService;
	private connectionManager: ConnectionManager;
	private orphanNotes: TFile[] = [];
	private settings: DailyZettelSettings;

	constructor(leaf: WorkspaceLeaf, settings: DailyZettelSettings) {
		super(leaf);
		this.settings = settings;
		this.orphanDetectorService = new OrphanDetectorService(this.app);
		this.connectionManager = new ConnectionManager(this.app);
	}

	getViewType(): string {
		return VIEW_TYPE_ORPHAN;
	}

	getDisplayText(): string {
		return "Orphan permanent notes";
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
	 * ビューをリフレッシュして孤立ノートを再取得
	 */
	async refresh(): Promise<void> {
		this.orphanNotes = await this.orphanDetectorService.getOrphanPermanentNotes();
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
						new Notice(`✅ ${structureFile.basename} に接続しました`);
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
		header.createEl("h4", { text: "Orphan permanent notes" });

		const refreshButton = header.createEl("button", {
			text: "更新",
			cls: "orphan-view-refresh-button",
		});
		refreshButton.addEventListener("click", () => {
			void this.refresh();
		});

		// 孤立ノートリスト
		if (this.orphanNotes.length === 0) {
			container.createDiv({
				text: "孤立したPermanent Noteはありません",
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
					text: "接続",
					cls: "orphan-view-connect-button",
				});

				connectButton.addEventListener("click", () => {
					this.connectNote(note);
				});
			}
		}
	}
}
