import { Notice, TFile } from "obsidian";
import { StructureSuggestModal } from "../ui/modals/structure-suggest-modal";
import { FrontmatterService } from "../services/frontmatter-service";
import type PageZettelPlugin from "../main";
import { t } from "../i18n";

export async function linkPermanent(plugin: PageZettelPlugin): Promise<void> {
	// 1. 現在のアクティブファイルを取得
	const file = plugin.app.workspace.getActiveFile();

	if (!file || !(file instanceof TFile)) {
		new Notice(t("notices.openNote"));
		return;
	}

	// 2. 現在のノートタイプを確認
	const frontmatterService = new FrontmatterService(plugin.app);
	const currentType = await frontmatterService.getNoteType(file);

	if (currentType !== "permanent") {
		new Notice(t("notices.permanentOnly"));
		return;
	}

	// 3. StructureSuggestModal で Structure Note を選択
	const modal = new StructureSuggestModal(
		plugin.app,
		plugin.settings,
		file,
		(structureFile: TFile | null) => {
			if (structureFile) {
				void (async () => {
					await plugin.connectionManager.linkPermanentToStructure(file, structureFile);
					new Notice(t("notices.linkSuccess", { name: structureFile.basename }));
				})();
			}
		},
	);

	modal.open();
}
