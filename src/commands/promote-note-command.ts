import { Notice, TFile } from "obsidian";
import { PROMOTION_PATHS } from "../types/note-types";
import { NoteTypeModal } from "../ui/modals/note-type-modal";
import { FrontmatterService } from "../services/frontmatter-service";
import type DailyZettelPlugin from "../main";
import type { NoteType } from "../types/note-types";

export async function promoteNote(plugin: DailyZettelPlugin): Promise<void> {
	// 1. 現在のアクティブファイルを取得
	const file = plugin.app.workspace.getActiveFile();

	if (!file || !(file instanceof TFile)) {
		new Notice("⚠️ ノートを開いてください");
		return;
	}

	// 2. 現在のノートタイプを取得
	const frontmatterService = new FrontmatterService(plugin.app);
	const currentType = await frontmatterService.getNoteType(file);

	if (!currentType) {
		new Notice("⚠️ ノートタイプが設定されていません");
		return;
	}

	// 3. 昇格可能なタイプを取得
	const promotableTo = PROMOTION_PATHS[currentType];

	if (!promotableTo || promotableTo.length === 0) {
		new Notice(`⚠️ ${currentType} ノートは昇格できません`);
		return;
	}

	// 4. NoteTypeModal で昇格先タイプを選択
	const modal = new NoteTypeModal(
		plugin.app,
		(toType: NoteType) => {
			void (async () => {
				await plugin.promotionService.promoteNote(file, currentType, toType);
				new Notice(`✅ ${currentType} → ${toType} に昇格しました`);
			})();
		},
		promotableTo,
	);

	modal.open();
}
