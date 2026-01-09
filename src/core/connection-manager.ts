import { App, TFile } from "obsidian";
import { FrontmatterService } from "../services/frontmatter-service";

export class ConnectionManager {
	private app: App;
	private frontmatterService: FrontmatterService;

	constructor(app: App) {
		this.app = app;
		this.frontmatterService = new FrontmatterService(app);
	}

	/**
	 * Permanent Note を Structure Note に接続
	 */
	async linkPermanentToStructure(permanentNote: TFile, structureNote: TFile): Promise<void> {
		// 1. Permanent Note のフロントマターを更新
		await this.frontmatterService.addStructureLink(permanentNote, structureNote);

		// 2. Structure Note にリンクを追加
		await this.appendLinkToStructure(structureNote, permanentNote);
	}

	/**
	 * Structure Note の本文にリンクを追加
	 */
	private async appendLinkToStructure(structureNote: TFile, targetNote: TFile): Promise<void> {
		const content = await this.app.vault.read(structureNote);
		const link = `- [[${targetNote.basename}]]`;

		// 既にリンクが存在するかチェック
		if (content.includes(`[[${targetNote.basename}]]`)) {
			return;
		}

		// "## 関連ノート" セクションを探して追加
		const sectionRegex = /^## (関連ノート|Related Notes|Notes)/m;
		const match = content.match(sectionRegex);

		let newContent: string;
		if (match && match.index !== undefined) {
			// セクションの次の行に追加
			const insertPos = content.indexOf("\n", match.index) + 1;
			newContent = content.slice(0, insertPos) + link + "\n" + content.slice(insertPos);
		} else {
			// セクションがなければ末尾に追加
			newContent = content + `\n\n## 関連ノート\n\n${link}\n`;
		}

		await this.app.vault.modify(structureNote, newContent);
	}
}
