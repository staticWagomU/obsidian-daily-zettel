import { App, TFile } from "obsidian";
import { FrontmatterService } from "./frontmatter-service";

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
}
