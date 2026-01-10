import { App, TFile, CachedMetadata } from "obsidian";
import type { PageZettelSettings } from "../types/settings";

export interface SuggestionScore {
	file: TFile;
	score: number;
	reasons: string[];
}

export class SuggestionService {
	private app: App;
	private settings: PageZettelSettings;

	constructor(app: App, settings: PageZettelSettings) {
		this.app = app;
		this.settings = settings;
	}

	/**
	 * Permanent Note に関連する Structure Notes を提案
	 */
	async suggestStructureNotes(permanentNote: TFile, limit: number = 5): Promise<TFile[]> {
		const structureNotes = this.getAllStructureNotes();
		const permanentMeta = this.app.metadataCache.getFileCache(permanentNote);
		const permanentTags = this.extractTags(permanentMeta);
		const permanentTitle = permanentNote.basename.toLowerCase();

		const scored: SuggestionScore[] = [];

		for (const structureNote of structureNotes) {
			const score = this.calculateScore(structureNote, permanentTags, permanentTitle);

			if (score.score > 0) {
				scored.push(score);
			}
		}

		// スコア降順でソート
		scored.sort((a, b) => b.score - a.score);

		return scored.slice(0, limit).map((s) => s.file);
	}

	/**
	 * 全ての Structure Notes を取得
	 */
	private getAllStructureNotes(): TFile[] {
		const structureFolder = this.settings.folders.typeFolders.structure;

		return this.app.vault.getMarkdownFiles().filter((file) => {
			// フォルダベースのフィルタ
			if (file.path.startsWith(structureFolder)) {
				return true;
			}

			// フロントマターベースのフィルタ
			const cache = this.app.metadataCache.getFileCache(file);
			return cache?.frontmatter?.type === "structure";
		});
	}

	/**
	 * スコアを計算
	 */
	private calculateScore(
		structureNote: TFile,
		targetTags: string[],
		targetTitle: string,
	): SuggestionScore {
		let score = 0;
		const reasons: string[] = [];

		const structureMeta = this.app.metadataCache.getFileCache(structureNote);
		const structureTags = this.extractTags(structureMeta);
		const structureTitle = structureNote.basename.toLowerCase();

		// タグの一致（各10点）
		for (const tag of targetTags) {
			if (structureTags.includes(tag)) {
				score += 10;
				reasons.push(`Tag match: ${tag}`);
			}
		}

		// タイトルの単語マッチ（各5点）
		const targetWords = targetTitle.split(/[\s-_]+/).filter((w) => w.length > 2);
		const structureWords = structureTitle.split(/[\s-_]+/).filter((w) => w.length > 2);

		for (const word of targetWords) {
			if (structureWords.some((sw) => sw.includes(word) || word.includes(sw))) {
				score += 5;
				reasons.push(`Title word match: ${word}`);
			}
		}

		// 既存のリンク関係（20点）
		if (structureMeta?.links) {
			const hasLink = structureMeta.links.some(
				(link) => link.link.toLowerCase() === targetTitle,
			);
			if (hasLink) {
				score += 20;
				reasons.push("Already linked");
			}
		}

		return { file: structureNote, score, reasons };
	}

	/**
	 * メタデータからタグを抽出
	 */
	private extractTags(meta: CachedMetadata | null): string[] {
		if (!meta) return [];

		const frontmatterTags = (meta.frontmatter?.tags as string[] | undefined) || [];
		const inlineTags = meta.tags?.map((t) => t.tag.replace("#", "")) || [];

		return [...new Set([...frontmatterTags, ...inlineTags])];
	}
}
