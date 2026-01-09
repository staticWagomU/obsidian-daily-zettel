import { App, TFile } from "obsidian";
import { FrontmatterService } from "./frontmatter-service";
import type { OrphanStats } from "../types";

export class OrphanDetectorService {
	private app: App;
	private frontmatterService: FrontmatterService;

	constructor(app: App) {
		this.app = app;
		this.frontmatterService = new FrontmatterService(app);
	}

	/**
	 * 孤立したPermanent Noteを取得
	 * structure_notesが空または未定義のpermanent typeのノートを返す
	 */
	async getOrphanPermanentNotes(): Promise<TFile[]> {
		const allFiles = this.app.vault.getMarkdownFiles();
		const orphans: TFile[] = [];

		for (const file of allFiles) {
			const noteType = await this.frontmatterService.getNoteType(file);
			if (noteType !== "permanent") {
				continue;
			}

			// structure_notesの存在チェック
			const cache = this.app.metadataCache.getFileCache(file);
			const structureNotes = cache?.frontmatter?.structure_notes as string[] | undefined;

			if (!structureNotes || structureNotes.length === 0) {
				orphans.push(file);
			}
		}

		return orphans;
	}

	/**
	 * Permanent Noteの接続統計を取得
	 * @returns OrphanStats オブジェクト（total, orphans, connected, connectionRate）
	 */
	async getStats(): Promise<OrphanStats> {
		const allFiles = this.app.vault.getMarkdownFiles();
		let totalPermanentNotes = 0;

		// 全permanentノート数を取得
		for (const file of allFiles) {
			const noteType = await this.frontmatterService.getNoteType(file);
			if (noteType === "permanent") {
				totalPermanentNotes++;
			}
		}

		// 孤立ノート数を取得
		const orphanNotes = await this.getOrphanPermanentNotes();
		const orphanCount = orphanNotes.length;

		// 接続済みノート数を計算
		const connectedCount = totalPermanentNotes - orphanCount;

		// 接続率を計算（0除算対応）
		const connectionRate =
			totalPermanentNotes === 0 ? 0 : (connectedCount / totalPermanentNotes) * 100;

		return {
			total: totalPermanentNotes,
			orphans: orphanCount,
			connected: connectedCount,
			connectionRate: connectionRate,
		};
	}
}
