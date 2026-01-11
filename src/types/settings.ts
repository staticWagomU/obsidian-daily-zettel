import { NoteType } from "./note-types";

/**
 * 各ノートタイプの詳細設定
 */
export interface NoteTypeSettings {
	/** フォルダパス */
	folder: string;
	/** ファイル名形式 (例: "{{date}}-{{title}}", "{{zettel-id}}-{{title}}") */
	fileNameFormat: string;
	/** エイリアス入力を表示するか */
	showAliasInput: boolean;
	/** テンプレートファイルパス (フォルダからの相対パス) */
	templatePath: string;
}

export interface PageZettelSettings {
	// ノートタイプ別設定
	fleeting: NoteTypeSettings;
	literature: NoteTypeSettings;
	permanent: NoteTypeSettings;

	// 共通フォルダ設定
	folders: FolderSettings;

	// 動作設定
	behavior: BehaviorSettings;

	// UI設定
	ui: UISettings;
}

export interface FolderSettings {
	/** テンプレートフォルダ */
	templateFolder: string;
	/** デイリーノートフォルダ */
	dailyNoteFolder: string;
}

export interface BehaviorSettings {
	/** 切り出し後に元ノートにリンクを挿入 */
	insertLinkAfterExtract: boolean;
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
