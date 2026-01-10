import { Notice, TFile } from "obsidian";
import { PROMOTION_PATHS } from "../types/note-types";
import { NoteTypeModal } from "../ui/modals/note-type-modal";
import { FrontmatterService } from "../services/frontmatter-service";
import type PageZettelPlugin from "../main";
import type { NoteType } from "../types/note-types";
import { t } from "../i18n";

export async function promoteNote(plugin: PageZettelPlugin): Promise<void> {
	// 1. 現在のアクティブファイルを取得
	const file = plugin.app.workspace.getActiveFile();

	if (!file || !(file instanceof TFile)) {
		new Notice(t("notices.openNote"));
		return;
	}

	// 2. 現在のノートタイプを取得
	const frontmatterService = new FrontmatterService(plugin.app);
	const currentType = await frontmatterService.getNoteType(file);

	if (!currentType) {
		new Notice(t("notices.noteTypeNotSet"));
		return;
	}

	// 3. 昇格可能なタイプを取得
	const promotableTo = PROMOTION_PATHS[currentType];

	if (!promotableTo || promotableTo.length === 0) {
		new Notice(t("notices.cannotPromote", { type: currentType }));
		return;
	}

	// 4. NoteTypeModal で昇格先タイプを選択
	const modal = new NoteTypeModal(
		plugin.app,
		(toType: NoteType) => {
			void (async () => {
				await plugin.promotionService.promoteNote(file, currentType, toType);
				new Notice(t("notices.promoteSuccess", { from: currentType, to: toType }));
			})();
		},
		promotableTo,
	);

	modal.open();
}
