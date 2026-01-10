import { Editor, MarkdownView, Notice } from "obsidian";
import { NoteType } from "../types/note-types";
import { NoteTypeModal } from "../ui/modals/note-type-modal";
import { StructureSuggestModal } from "../ui/modals/structure-suggest-modal";
import type PageZettelPlugin from "../main";
import { t } from "../i18n";

export async function extractSelection(
	plugin: PageZettelPlugin,
	editor: Editor,
	view: MarkdownView,
): Promise<void> {
	// 1. 選択テキストを取得
	const selection = editor.getSelection();

	if (!selection || selection.trim() === "") {
		new Notice(t("notices.selectText"));
		return;
	}

	// 2. ノートタイプを選択
	const modal = new NoteTypeModal(
		plugin.app,
		(type: NoteType) => {
			void createNoteFromSelection(plugin, editor, view, selection, type);
		},
		["fleeting", "literature", "permanent"], // 切り出し時の選択肢
	);

	modal.open();
}

async function createNoteFromSelection(
	plugin: PageZettelPlugin,
	editor: Editor,
	view: MarkdownView,
	selection: string,
	type: NoteType,
): Promise<void> {
	// 3. タイトルを生成（最初の行 or 最初の40文字）
	const firstLine = (selection.split("\n")[0] || selection).trim();
	const title = firstLine.length > 40 ? firstLine.slice(0, 40) + "..." : firstLine;

	// 4. ノートを作成
	const sourceFile = plugin.app.workspace.getActiveFile();

	const newFile = await plugin.noteManager.createNote({
		title,
		type,
		content: selection,
		sourceFile: sourceFile || undefined,
	});

	// 5. 元ノートにリンクを挿入（設定で有効な場合）
	if (plugin.settings.behavior.insertLinkAfterExtract) {
		const link = `[[${newFile.basename}]]`;
		editor.replaceSelection(link);
	}

	// 6. Permanent の場合は Structure Note への接続を提案
	if (type === "permanent" && plugin.settings.behavior.suggestStructureOnPermanent) {
		const structureModal = new StructureSuggestModal(
			plugin.app,
			plugin.settings,
			newFile,
			(structureFile) => {
				if (structureFile) {
					void plugin.connectionManager.linkPermanentToStructure(newFile, structureFile);
				}
			},
		);
		structureModal.open();
	}

	// 7. 新規ノートを開く
	await plugin.app.workspace.openLinkText(newFile.path, "");
}
