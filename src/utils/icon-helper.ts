import type { PageZettelSettings } from "../types/settings";
import type { NoteType } from "../types/note-types";
import { DEFAULT_NOTE_TYPE_ICONS } from "../data/emoji-catalog";

/**
 * 指定されたノートタイプのアイコンを取得
 * 設定値があれば設定値、なければデフォルト値を返す
 */
export function getIconForNoteType(settings: PageZettelSettings, type: NoteType): string {
	const customIcon = settings[type].icon;
	if (customIcon && customIcon.trim()) {
		return customIcon;
	}
	return DEFAULT_NOTE_TYPE_ICONS[type] || "📄";
}
