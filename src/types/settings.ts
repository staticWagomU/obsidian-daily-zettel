/**
 * 各ノートタイプの詳細設定
 */
export interface NoteTypeSettings {
	/** フォルダパス */
	folder: string;
	/** ファイル名形式 (例: "{{date}}-{{title}}", "{{zettel-id}}-{{title}}") */
	fileNameFormat: string;
	/** タイトル入力を表示するか */
	showTitleInput: boolean;
	/** テンプレートファイルパス（絶対パス） */
	templatePath: string;
	/** カスタムアイコン（絵文字） */
	icon: string;
}

export interface PageZettelSettings {
	// ノートタイプ別設定
	fleeting: NoteTypeSettings;
	literature: NoteTypeSettings;
	permanent: NoteTypeSettings;

	// 動作設定
	behavior: BehaviorSettings;

	// UI設定
	ui: UISettings;
}

export interface BehaviorSettings {
	/** 切り出し後に元ノートにリンクを挿入 */
	insertLinkAfterExtract: boolean;
	/** 切り出し後に新規ノートを開く */
	openAfterExtract: boolean;
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
	/** Quick Add Widget (FAB) を表示 */
	showQuickAddWidget: boolean;
	/** Quick Add Widget の位置 */
	quickAddWidgetPosition: "bottom-right" | "bottom-left";
}
