import { NoteType } from "./note-types";

export interface PageZettelSettings {
	// フォルダ設定
	folders: FolderSettings;

	// 動作設定
	behavior: BehaviorSettings;

	// UI設定
	ui: UISettings;
}

export interface FolderSettings {
	/** ノートタイプ別フォルダパス */
	typeFolders: Record<NoteType, string>;
	/** テンプレートフォルダ */
	templateFolder: string;
	/** デイリーノートフォルダ */
	dailyNoteFolder: string;
}

export interface BehaviorSettings {
	/** 切り出し後に元ノートにリンクを挿入 */
	insertLinkAfterExtract: boolean;
	/** Permanent 作成時に Structure 提案を表示 */
	suggestStructureOnPermanent: boolean;
	/** 昇格時に自動でフォルダ移動 */
	moveOnPromotion: boolean;
	/** ファイル名のプレフィックス形式 */
	fileNamePrefix: "date" | "zettel-id" | "none";
}

export interface UISettings {
	/** コマンドに絵文字を表示 */
	showEmojiInCommands: boolean;
	/** モバイル最適化UI */
	mobileOptimized: boolean;
	/** コンテキストメニューにノート操作を表示 */
	showContextMenuItems: boolean;
}
