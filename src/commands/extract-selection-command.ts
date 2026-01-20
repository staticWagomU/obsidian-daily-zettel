import { Editor, MarkdownView, Notice } from "obsidian";
import { NoteType } from "../types/note-types";
import { NoteTypeModal } from "../ui/modals/note-type-modal";
import { TitleInputModal } from "../ui/modals/title-input-modal";
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
		plugin.settings,
		(type: NoteType) => {
			void showTitleInputOrCreate(plugin, editor, view, selection, type);
		},
		["fleeting", "literature", "permanent"], // 切り出し時の選択肢
	);

	modal.open();
}

/**
 * 指定されたノートタイプに直接切り出す（NoteTypeModalをスキップ）
 * コンテキストメニューから特定タイプを直接選択した場合に使用
 */
export async function extractSelectionToType(
	plugin: PageZettelPlugin,
	editor: Editor,
	view: MarkdownView,
	type: NoteType,
): Promise<void> {
	// 選択テキストを取得
	const selection = editor.getSelection();

	if (!selection || selection.trim() === "") {
		new Notice(t("notices.selectText"));
		return;
	}

	// 直接showTitleInputOrCreateへ（NoteTypeModalをスキップ）
	await showTitleInputOrCreate(plugin, editor, view, selection, type);
}

async function showTitleInputOrCreate(
	plugin: PageZettelPlugin,
	editor: Editor,
	view: MarkdownView,
	selection: string,
	type: NoteType,
): Promise<void> {
	// 設定確認: showTitleInputフラグ
	const showTitleInput = plugin.settings[type].showTitleInput;

	if (!showTitleInput) {
		// showTitleInput=falseの場合、TitleInputModalをスキップしてノート作成
		await createNoteFromSelection(plugin, editor, view, selection, type, "", false);
		return;
	}

	// showTitleInput=trueの場合、TitleInputModalを表示
	const titleModal = new TitleInputModal(
		plugin.app,
		plugin,
		(result) => {
			void createNoteFromSelection(
				plugin,
				editor,
				view,
				selection,
				type,
				result.title,
				result.removeIndent,
			);
		},
		true, // Extract時なのでremoveIndentチェックボックスを表示
	);

	titleModal.open();
}

async function createNoteFromSelection(
	plugin: PageZettelPlugin,
	editor: Editor,
	view: MarkdownView,
	selection: string,
	type: NoteType,
	alias: string,
	removeIndent: boolean,
): Promise<void> {
	// 3. インデント削除処理（removeIndent=trueの場合）
	let content = selection;
	if (removeIndent) {
		content = removeCommonIndent(selection);
	}

	// 4. 元ノートを取得
	const sourceFile = plugin.app.workspace.getActiveFile();

	// 5. NoteCreatorServiceでノートを作成
	const newFile = await plugin.noteCreatorService.createNote(
		type,
		content,
		alias,
		sourceFile || undefined,
	);

	// 6. 元ノートにリンクを挿入（設定で有効な場合）
	if (plugin.settings.behavior.insertLinkAfterExtract) {
		// マークダウンリンク形式: [表示名](相対パス)
		const linkText = alias || newFile.basename;
		const relativePath = sourceFile
			? plugin.app.metadataCache.fileToLinktext(newFile, sourceFile.path)
			: newFile.path;
		const link = `[${linkText}](${relativePath})`;
		editor.replaceSelection(link);
	}

	// 7. 新規ノートを開く（設定で有効な場合）
	if (plugin.settings.behavior.openAfterExtract) {
		await plugin.app.workspace.openLinkText(newFile.path, "");
	}
}

/**
 * 共通インデントを削除
 */
function removeCommonIndent(text: string): string {
	const lines = text.split("\n");
	if (lines.length === 0) return text;

	// 空行を除外して最小インデントを計算
	const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
	if (nonEmptyLines.length === 0) return text;

	const minIndent = Math.min(
		...nonEmptyLines.map((line) => {
			const match = line.match(/^(\s*)/);
			return match?.[1]?.length ?? 0;
		}),
	);

	// 各行から共通インデントを削除
	return lines.map((line) => line.slice(minIndent)).join("\n");
}
