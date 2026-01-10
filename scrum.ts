// ============================================================
// Dashboard Data (AI edits this section)
// ============================================================

const userStoryRoles = [
  "Obsidianモバイルユーザー",
  "Zettelkasten実践者",
] as const satisfies readonly string[];

const scrum: ScrumDashboard = {
  product_goal: {
    statement:
      "最小限の操作でノートの切り出し・分類・接続を自動化する",
    success_metrics: [
      { metric: "ノート作成のタップ数", target: "3タップ以内" },
      { metric: "Structure Note接続率", target: "80%以上のPermanent Noteが接続済み" },
    ],
  },

  product_backlog: [
    // Phase 1: 基盤構築 (PBI-001〜004: done)
    { id: "PBI-001", story: { role: "Zettelkasten実践者", capability: "ノートタイプを識別できる", benefit: "5種類のノートを適切に分類・管理" }, acceptance_criteria: [{ criterion: "NoteType型+CONFIG+PROMOTION_PATHS", verification: "pnpm build成功" }], status: "done" },
    { id: "PBI-002", story: { role: "Zettelkasten実践者", capability: "フロントマターでメタデータ管理", benefit: "ノート間の関係性を自動追跡" }, acceptance_criteria: [{ criterion: "add/update/get/addStructureLink/updateTags", verification: "全メソッド実装" }], status: "done" },
    { id: "PBI-003", story: { role: "Obsidianモバイルユーザー", capability: "選択テキストから新規ノート作成", benefit: "デイリーノートから素早くアイデア切り出し" }, acceptance_criteria: [{ criterion: "NoteTypeModal+フロントマター+リンク置換+Structure提案", verification: "E2E動作確認" }], status: "done" },
    { id: "PBI-004", story: { role: "Obsidianモバイルユーザー", capability: "テンプレートでノート作成", benefit: "一貫したフォーマット管理" }, acceptance_criteria: [{ criterion: "getProcessedTemplate+変数展開+5テンプレート+フォールバック", verification: "Templates/*.md存在" }], status: "done" },
    { id: "PBI-005", story: { role: "Obsidianモバイルユーザー", capability: "プラグイン設定カスタマイズ", benefit: "ワークフロー調整" }, acceptance_criteria: [{ criterion: "3セクション+7テキスト+4トグル+dropdown+saveSettings永続化", verification: "設定変更が再読み込み後も保持" }], status: "done" },
    // Phase 2: 接続管理
    { id: "PBI-006", story: { role: "Zettelkasten実践者", capability: "ノート昇格（Fleeting→Permanent等）", benefit: "アイデアを段階的に成熟" }, acceptance_criteria: [{ criterion: "PromoteNoteCommand（PROMOTION_PATHSバリデーション+NoteTypeModal選択）", verification: "コマンド登録・Modal表示確認" }, { criterion: "PromotionService.promoteNote（フロントマター更新：type/promoted_from/promoted_at/tags+フォルダ移動：vault.rename）", verification: "昇格後フロントマター・フォルダ検証" }, { criterion: "昇格不可（literature/index）はModal選択肢非表示、空PROMOTION_PATHSはNotice警告", verification: "バリデーションエラーハンドリング" }], status: "done" },
    { id: "PBI-007", story: { role: "Zettelkasten実践者", capability: "PermanentをStructureに接続", benefit: "知識ネットワーク構築" }, acceptance_criteria: [{ criterion: "ConnectionManager.linkPermanentToStructure（Permanentフロントマターにstructure_notes追加+Structureノート本文の「## 関連ノート」セクションにリンク追加）", verification: "双方向リンク確認：frontmatter.structure_notes配列+本文リンク存在" }, { criterion: "LinkPermanentCommand（現在ノートがpermanent type確認→StructureSuggestModal表示→ConnectionManager呼び出し）", verification: "コマンド登録・Modal表示・接続完了Notice" }, { criterion: "StructureSuggestModal統合（SuggestionService提案表示+Skipオプション+選択時ConnectionManager経由接続）", verification: "Modal起動→提案リスト表示→選択で双方向リンク作成" }], status: "done" },
    // Phase 3: 可視化
    { id: "PBI-008", story: { role: "Zettelkasten実践者", capability: "孤立Permanent Note発見", benefit: "Structure接続漏れ防止" }, acceptance_criteria: [{ criterion: "OrphanDetectorService.getOrphanPermanentNotes()（type=permanent && structure_notes空/未定義のTFile配列を返す）", verification: "FrontmatterService統合、孤立ノート取得確認" }, { criterion: "OrphanView extends ItemView（サイドバー登録、リスト表示、リフレッシュボタン、OrphanDetectorService呼び出し）", verification: "サイドバーアイコンクリック→孤立ノートリスト表示" }, { criterion: "各リストアイテムに接続ボタン（クリックでStructureSuggestModal起動、接続後ビュー自動更新）", verification: "ボタンクリック→Modal表示→接続完了後リストから削除" }], status: "done" },
    // Phase 4: UX強化
    { id: "PBI-009", story: { role: "Obsidianモバイルユーザー", capability: "ワンタップでFleeting Note作成", benefit: "デイリーノートを開かずに素早くアイデアキャプチャ" }, acceptance_criteria: [{ criterion: "QuickCaptureModal（テキスト入力+Enter/Escape+ボタン）", verification: "Modal表示確認" }, { criterion: "quick-fleetingコマンド登録（絵文字切り替え対応）", verification: "コマンドパレット→Modal起動" }, { criterion: "NoteManager.createNote統合→10-Fleeting→自動オープン", verification: "E2Eノート作成確認" }], status: "done" },
    { id: "PBI-010", story: { role: "Zettelkasten実践者", capability: "プラグイン初回起動時にフォルダ構造自動生成", benefit: "手動フォルダ作成不要でZettelkasten開始" }, acceptance_criteria: [{ criterion: "FolderService.initializeAllFolders()（全NoteType[\"fleeting\", \"literature\", \"permanent\", \"structure\", \"index\"]に対しensureFolderExists()呼び出し、settings.folders.templateFolderも作成、既存フォルダはスキップ）", verification: "メソッド呼び出し後、vault.getAbstractFileByPath()で6フォルダ存在確認" }, { criterion: "main.ts onload()内で、settings読込後・services初期化前にFolderService.initializeAllFolders()呼び出し", verification: "プラグイン有効化（初回起動）→vault確認で自動フォルダ作成、2回目起動で既存フォルダスキップ" }], status: "done" },
    { id: "PBI-011", story: { role: "Zettelkasten実践者", capability: "Permanent Note接続率を数値で確認", benefit: "知識ネットワーク健全性の定量把握" }, acceptance_criteria: [{ criterion: "OrphanDetectorService.getStats()（型定義: interface OrphanStats { total: number; orphans: number; connected: number; connectionRate: number; }、全permanentノート数取得→getOrphanPermanentNotes()で孤立数→connected = total - orphans→connectionRate計算）", verification: "メソッド呼び出しでOrphanStatsオブジェクト取得、total/orphans/connected/connectionRate値の整合性確認" }, { criterion: "OrphanView.onOpen()でOrphanDetectorService.getStats()呼び出し、ヘッダーに統計情報表示（\"📊 接続率: X% (Y / Z 件が未接続)\"形式、リフレッシュ時に統計更新）", verification: "サイドバービュー開く→ヘッダー統計表示確認、リフレッシュボタン→統計更新確認" }], status: "done" },
    // Phase 5: 設定UX改善
    { id: "PBI-012", story: { role: "Zettelkasten実践者", capability: "設定画面でフォルダをサジェストから選択", benefit: "手入力のタイポ防止・既存フォルダの発見" }, acceptance_criteria: [{ criterion: "FolderSuggest extends AbstractInputSuggest<TFolder>（getSuggestions: vault.getAllLoadedFiles()→TFolderフィルタ→入力文字列で部分一致検索、renderSuggestion: folder.path表示、selectSuggestion: inputEl.valueに設定→close()）", verification: "src/ui/suggesters/folder-suggest.ts存在、pnpm build成功" }, { criterion: "DailyZettelSettingTab内の7つのフォルダ入力テキストボックス（Fleeting/Literature/Permanent/Structure/Index/Template/DailyNote）にFolderSuggestをアタッチ", verification: "設定画面→各フォルダ入力欄で文字入力→既存フォルダがドロップダウン表示" }, { criterion: "サジェスト選択時にonChange発火→settings自動保存", verification: "サジェストから選択→設定タブを閉じて再開→選択値が保持" }], status: "done" },
    // Phase 6: アクセシビリティ改善
    { id: "PBI-013", story: { role: "Obsidianモバイルユーザー", capability: "右クリックコンテキストメニューからノート操作を実行", benefit: "コマンドパレットを開かずに素早くアクセス" }, acceptance_criteria: [{ criterion: "エディタコンテキストメニュー統合（workspace.on('editor-menu')をregisterEvent、選択テキストがある場合「選択範囲から新規ノート」表示、常時「ノートを昇格」「Structure Noteに接続」表示、menu.addItem()で追加）", verification: "エディタ右クリック→メニュー項目表示確認、選択状態で項目変化確認" }, { criterion: "ファイルエクスプローラコンテキストメニュー統合（workspace.on('file-menu')をregisterEvent、.mdファイル右クリック時「ノートを昇格」「Structure Noteに接続」表示、menu.addItem()で追加）", verification: "ファイルエクスプローラで.mdファイル右クリック→メニュー項目表示確認" }, { criterion: "設定画面でコンテキストメニュー表示ON/OFF切り替え（settings.ui.showContextMenuItemsトグル追加、デフォルト: true、トグルOFF時はregisterEvent呼び出しスキップ）", verification: "設定画面→トグル表示確認、OFF時メニュー非表示、ON時メニュー表示" }], status: "done" },
    // Phase 7: 国際化対応
    { id: "PBI-014", story: { role: "Obsidianモバイルユーザー", capability: "UIを英語/日本語で表示", benefit: "言語設定に合わせた自然なUI体験" }, acceptance_criteria: [{ criterion: "i18n基盤構築（src/i18n/index.ts: t()関数・getCurrentLocale()実装、src/i18n/locales/en.json: 英語翻訳JSON、src/i18n/locales/ja.json: 日本語翻訳JSON、getLanguage() APIでObsidianのロケールを検出、デフォルトjaにフォールバック）", verification: "t('commands.extractSelection')等の呼び出しでlocaleに応じた文字列取得、pnpm build成功" }, { criterion: "コマンド・コンテキストメニューのi18n化（main.ts: 4つのaddCommand().name・3つのeditor-menu setTitle()・2つのfile-menu setTitle()をt()で置換、絵文字設定対応維持）", verification: "Obsidian言語設定en/ja切り替え→コマンドパレット・コンテキストメニューの表示言語切り替え確認" }, { criterion: "設定画面のi18n化（settings.ts: 3セクションヘッディング・12項目のsetName()/setDesc()/setPlaceholder()をt()で置換、dropdownのaddOption()ラベルもi18n化）", verification: "Obsidian言語設定en/ja切り替え→設定画面の全テキスト表示言語切り替え確認" }, { criterion: "モーダル・ビュー・Noticeのi18n化（QuickCaptureModal: 3箇所、StructureSuggestModal: 2箇所、NoteTypeModal: 1箇所、OrphanView: 5箇所、Notice messages: 9箇所、NoteManager: 1箇所、ribbon icon: 1箇所をt()で置換）", verification: "Obsidian言語設定en/ja切り替え→Modal・View・Notice・ribbon iconの全テキスト表示言語切り替え確認" }], status: "done" },
    { id: "PBI-015", story: { role: "Obsidianモバイルユーザー", capability: "コンテキストメニューでプラグインコマンドをグルーピング表示", benefit: "視覚的に整理されたメニューで操作性向上" }, acceptance_criteria: [{ criterion: "エディタコンテキストメニューグルーピング（menu.addItem().setSection('page-zettel')使用、セクション内に「選択範囲から新規ノート」「ノートを昇格」「Structure Noteに接続」を配置、menu.addSeparator()でセクション前後を視覚的分離）", verification: "エディタ右クリック→セパレーターで区切られたPage Zettelセクション表示→各コマンド選択可能" }, { criterion: "ファイルエクスプローラコンテキストメニューグルーピング（menu.addItem().setSection('page-zettel')使用、セクション内に「ノートを昇格」「Structure Noteに接続」を配置、menu.addSeparator()でセクション前後を視覚的分離）", verification: "ファイルエクスプローラ.md右クリック→セパレーターで区切られたPage Zettelセクション表示→各コマンド選択可能" }, { criterion: "絵文字設定対応維持（settings.ui.showEmojiInCommandsに応じてメニュー項目の絵文字表示切り替え）", verification: "絵文字ON時は「📝 選択範囲から新規ノート」等、OFF時は絵文字なし表示" }], status: "done" },
  ],

  sprint: null,

  definition_of_done: {
    checks: [
      { name: "Build passes", run: "pnpm build" },
      { name: "Lint passes", run: "pnpm lint" },
      { name: "Format check passes", run: "pnpm format:check" },
    ],
  },

  completed: [
    { number: 1, pbi_id: "PBI-001", goal: "NoteType型定義", status: "done", subtasks: [{ test: "型+定数", implementation: "src/types/note-types.ts", type: "behavioral", status: "completed", commits: [{ hash: "1eb7e33", message: "feat: NoteType system", phase: "green" }], notes: [] }] },
    { number: 2, pbi_id: "PBI-002", goal: "FrontmatterService", status: "done", subtasks: [{ test: "5メソッド", implementation: "src/services/frontmatter-service.ts", type: "behavioral", status: "completed", commits: [{ hash: "0268c21", message: "feat: FrontmatterService", phase: "green" }], notes: [] }] },
    { number: 3, pbi_id: "PBI-003", goal: "選択テキスト→ノート", status: "done", subtasks: [{ test: "Command+Modal", implementation: "src/commands/,src/ui/modals/", type: "behavioral", status: "completed", commits: [{ hash: "527d854", message: "feat: ExtractSelection", phase: "green" }], notes: [] }] },
    { number: 4, pbi_id: "PBI-004", goal: "テンプレートノート作成", status: "done", subtasks: [{ test: "TemplateService", implementation: "src/services/template-service.ts", type: "behavioral", status: "completed", commits: [{ hash: "275b08c", message: "feat: TemplateService", phase: "green" }], notes: [] }] },
    { number: 5, pbi_id: "PBI-005", goal: "設定タブUI実装", status: "done", subtasks: [{ test: "SettingTab+永続化", implementation: "src/settings.ts", type: "behavioral", status: "completed", commits: [{ hash: "34e5338", message: "feat: SettingTab", phase: "green" }], notes: [] }] },
    { number: 6, pbi_id: "PBI-006", goal: "ノート昇格機能", status: "done", subtasks: [{ test: "PromotionService+Command", implementation: "src/services/promotion-service.ts,src/commands/promote-note-command.ts", type: "behavioral", status: "completed", commits: [{ hash: "ca4d202", message: "feat: PromotionService", phase: "green" }, { hash: "7ee7498", message: "feat: PromoteNoteCommand", phase: "green" }], notes: [] }] },
    { number: 7, pbi_id: "PBI-007", goal: "Permanent-Structure接続", status: "done", subtasks: [{ test: "ConnectionManager+LinkCommand", implementation: "src/core/connection-manager.ts,src/commands/link-permanent-command.ts", type: "behavioral", status: "completed", commits: [{ hash: "67af70b", message: "feat: ConnectionManager", phase: "green" }, { hash: "fb76382", message: "feat: LinkPermanentCommand", phase: "green" }], notes: [] }] },
    { number: 8, pbi_id: "PBI-008", goal: "孤立Permanent Note発見", status: "done", subtasks: [{ test: "OrphanDetector+View+接続ボタン", implementation: "src/services/orphan-detector-service.ts,src/ui/views/orphan-view.ts", type: "behavioral", status: "completed", commits: [{ hash: "af1660f", message: "feat: OrphanDetectorService", phase: "green" }, { hash: "b775960", message: "feat: OrphanView", phase: "green" }, { hash: "89e632f", message: "feat: 接続ボタン統合", phase: "green" }], notes: [] }] },
    { number: 9, pbi_id: "PBI-011", goal: "接続率統計表示", status: "done", subtasks: [{ test: "getStats()+UI統合", implementation: "src/services/orphan-detector-service.ts,src/ui/views/orphan-view.ts", type: "behavioral", status: "completed", commits: [{ hash: "151f9ac", message: "feat: getStats()", phase: "green" }, { hash: "374cc68", message: "feat: 統計表示UI", phase: "green" }], notes: [] }] },
    { number: 10, pbi_id: "PBI-009", goal: "ワンタップFleeting Note作成", status: "done", subtasks: [{ test: "QuickCaptureModal+コマンド登録+E2E統合", implementation: "src/ui/modals/quick-capture-modal.ts,src/main.ts", type: "behavioral", status: "completed", commits: [{ hash: "3df2861", message: "feat(PBI-009): implement QuickCaptureModal", phase: "green" }, { hash: "00a260e", message: "feat(PBI-009): register quick-fleeting command", phase: "green" }], notes: [] }] },
    { number: 11, pbi_id: "PBI-010", goal: "初回起動時フォルダ自動生成", status: "done", subtasks: [{ test: "FolderService.initializeAllFolders()+main.ts統合", implementation: "src/services/folder-service.ts,src/main.ts", type: "behavioral", status: "completed", commits: [{ hash: "6562f6c", message: "feat(PBI-010): implement automatic folder structure initialization", phase: "green" }], notes: [] }] },
    { number: 12, pbi_id: "PBI-012", goal: "FolderSuggest機能で設定画面のUX向上", status: "done", subtasks: [{ test: "FolderSuggest extends AbstractInputSuggest<TFolder>（getSuggestions: vault.getAllLoadedFiles()→TFolderフィルタ→入力文字列で部分一致検索、renderSuggestion: folder.path表示、selectSuggestion: inputEl.valueに設定→close()）", implementation: "src/ui/suggesters/folder-suggest.ts", type: "behavioral", status: "completed", commits: [{ hash: "2c1069c", message: "feat(PBI-012): implement FolderSuggest class", phase: "green" }], notes: [] }, { test: "DailyZettelSettingTab内の7つのフォルダ入力テキストボックス（Fleeting/Literature/Permanent/Structure/Index/Template/DailyNote）にFolderSuggestをアタッチ、サジェスト選択時にonChange発火→settings自動保存", implementation: "src/settings.ts", type: "behavioral", status: "completed", commits: [{ hash: "96bc2da", message: "feat(PBI-012): integrate FolderSuggest with settings", phase: "green" }], notes: [] }] },
    { number: 13, pbi_id: "PBI-013", goal: "コンテキストメニューからノート操作でアクセシビリティ向上", status: "done", subtasks: [{ test: "エディタコンテキストメニュー統合（workspace.on('editor-menu')をregisterEvent、選択テキストがある場合「選択範囲から新規ノート」表示、常時「ノートを昇格」「Structure Noteに接続」表示、settings.ui.showContextMenuItemsで表示制御）", implementation: "src/main.ts", type: "behavioral", status: "completed", commits: [{ hash: "31a755d", message: "feat(PBI-013): implement editor context menu integration", phase: "green" }], notes: [] }, { test: "ファイルエクスプローラコンテキストメニュー統合（workspace.on('file-menu')をregisterEvent、.mdファイル右クリック時のみ「ノートを昇格」「Structure Noteに接続」表示）", implementation: "src/main.ts", type: "behavioral", status: "completed", commits: [{ hash: "ef716b0", message: "feat(PBI-013): implement file explorer context menu integration", phase: "green" }], notes: [] }, { test: "設定画面UI追加（settings.ui.showContextMenuItemsトグル追加、UI設定セクションに配置、デフォルト: true）", implementation: "src/settings.ts", type: "behavioral", status: "completed", commits: [{ hash: "1770f67", message: "feat(PBI-013): add showContextMenuItems toggle to settings", phase: "green" }], notes: [] }] },
    { number: 14, pbi_id: "PBI-015", goal: "コンテキストメニューでプラグインコマンドをグルーピング表示し、視覚的な操作性を向上", status: "done", subtasks: [{ test: "editor-menuハンドラで各menu.addItem()に.setSection('page-zettel')を追加、menu.addSeparator()でセクション分離を確認", implementation: "src/main.ts (editor-menu handler)", type: "behavioral", status: "completed", commits: [{ hash: "8df2157", message: "feat(PBI-015): add context menu grouping for improved visual organization", phase: "green" }], notes: [] }, { test: "file-menuハンドラで各menu.addItem()に.setSection('page-zettel')を追加、menu.addSeparator()でセクション分離を確認", implementation: "src/main.ts (file-menu handler)", type: "behavioral", status: "completed", commits: [{ hash: "8df2157", message: "feat(PBI-015): add context menu grouping for improved visual organization", phase: "green" }], notes: [] }, { test: "settings.ui.showEmojiInCommandsトグルでメニュー項目の絵文字表示が切り替わることを確認", implementation: "既存ロジックの動作確認 (DoD検証)", type: "behavioral", status: "completed", commits: [{ hash: "8df2157", message: "feat(PBI-015): add context menu grouping for improved visual organization", phase: "green" }], notes: [] }] },
    { number: 15, pbi_id: "PBI-014", goal: "i18n国際化対応基盤の構築と全UI要素の多言語化", status: "done", subtasks: [{ test: "i18n基盤構築（src/i18n/index.ts: t()関数・getCurrentLocale()実装、src/i18n/locales/en.json: 英語翻訳JSON、src/i18n/locales/ja.json: 日本語翻訳JSON、getLanguage() APIでObsidianのロケールを検出、デフォルトjaにフォールバック）", implementation: "src/i18n/index.ts, src/i18n/locales/en.json, src/i18n/locales/ja.json", type: "behavioral", status: "completed", commits: [{ hash: "65d7639", message: "feat(PBI-014): implement i18n infrastructure with locale detection", phase: "green" }], notes: [] }, { test: "コマンド・コンテキストメニューのi18n化（main.ts: 4つのaddCommand().name・3つのeditor-menu setTitle()・2つのfile-menu setTitle()をt()で置換、絵文字設定対応維持）", implementation: "src/main.ts", type: "behavioral", status: "completed", commits: [{ hash: "2adb8f0", message: "feat(PBI-014): internationalize commands and context menus", phase: "green" }], notes: [] }, { test: "設定画面のi18n化（settings.ts: 3セクションヘッディング・12項目のsetName()/setDesc()/setPlaceholder()をt()で置換、dropdownのaddOption()ラベルもi18n化）", implementation: "src/settings.ts", type: "behavioral", status: "completed", commits: [{ hash: "48ae0c6", message: "feat(PBI-014): internationalize settings screen", phase: "green" }], notes: [] }, { test: "モーダル・ビュー・Noticeのi18n化（QuickCaptureModal: 3箇所、StructureSuggestModal: 2箇所、NoteTypeModal: 1箇所、OrphanView: 5箇所、Notice messages: 9箇所、NoteManager: 1箇所、ribbon icon: 1箇所をt()で置換）", implementation: "src/ui/modals/quick-capture-modal.ts, src/ui/modals/structure-suggest-modal.ts, src/ui/modals/note-type-modal.ts, src/ui/views/orphan-view.ts, src/core/note-manager.ts, src/main.ts (ribbon)", type: "behavioral", status: "completed", commits: [{ hash: "9f36e7d", message: "feat(PBI-014): internationalize modals, views, and notices", phase: "green" }], notes: [] }] },
  ],

  retrospectives: [
    { sprint: 1, improvements: [{ action: "DoD検証", timing: "sprint", status: "completed", outcome: "Sprint2適用" }] },
    { sprint: 2, improvements: [{ action: "サブタスク小分割", timing: "sprint", status: "completed", outcome: "Sprint3適用" }] },
    { sprint: 3, improvements: [{ action: "サブタスク=コミット単位", timing: "sprint", status: "completed", outcome: "Sprint4確認" }] },
    { sprint: 4, improvements: [{ action: "AC-実装整合性確認", timing: "sprint", status: "completed", outcome: "Sprint5確認" }] },
    { sprint: 5, improvements: [{ action: "1AC=1論理グループ", timing: "sprint", status: "completed", outcome: "Sprint6達成" }] },
    { sprint: 6, improvements: [{ action: "AC依存関係順", timing: "sprint", status: "completed", outcome: "Sprint7成功" }] },
    { sprint: 7, improvements: [{ action: "既存実装検索必須化", timing: "sprint", status: "completed", outcome: "Sprint8/9確立" }] },
    { sprint: 8, improvements: [{ action: "メンテナンスPBI候補作成", timing: "product", status: "active", outcome: null }] },
    { sprint: 9, improvements: [{ action: "既存実装拡張パターン継続", timing: "sprint", status: "completed", outcome: "getStats()+UI統合成功" }] },
    { sprint: 10, improvements: [{ action: "Modal実装前に既存Modal調査を必須化", timing: "sprint", status: "completed", outcome: "Sprint11でModal不使用" }] },
    { sprint: 11, improvements: [{ action: "既存Service活用を実装前調査で確認", timing: "sprint", status: "completed", outcome: "Sprint12でAbstractInputSuggest調査・活用成功" }] },
    { sprint: 12, improvements: [{ action: "Obsidian API既存クラス継承パターン（AbstractInputSuggest, Modal等）の活用を継続", timing: "sprint", status: "completed", outcome: "Sprint13でworkspace events（editor-menu, file-menu）パターン適用成功" }] },
    { sprint: 13, improvements: [{ action: "Refinementでの型定義事前確認を継続", timing: "sprint", status: "completed", outcome: "Sprint14でsetSubmenu()非公開API発見、代替手段(setSection+addSeparator)採用成功" }, { action: "workspace eventsパターン（editor-menu, file-menu等）の活用を継続", timing: "sprint", status: "completed", outcome: "Sprint14でsetSection()パターン適用成功" }] },
    { sprint: 14, improvements: [{ action: "RefinementフェーズでObsidian API実装調査時に、型定義ファイル(obsidian.d.ts)の確認を必須化", timing: "sprint", status: "completed", outcome: "Sprint15でgetLanguage() API発見・活用成功、obsidian.d.tsからMoment.locale()情報も確認" }] },
    { sprint: 15, improvements: [{ action: "tsconfig.json更新（resolveJsonModule等）をRefinementフェーズで確認", timing: "sprint", status: "active", outcome: null }, { action: "変数展開パターン（t(key, {var: value})）の継続活用", timing: "sprint", status: "active", outcome: null }] },
  ],
};

// ============================================================
// Type Definitions (DO NOT MODIFY - request human review for schema changes)
// ============================================================

// PBI lifecycle: draft (idea) -> refining (gathering info) -> ready (can start) -> done
type PBIStatus = "draft" | "refining" | "ready" | "done";
// Sprint lifecycle
type SprintStatus = "planning" | "in_progress" | "review" | "done" | "cancelled";

// TDD cycle: pending -> red (test written) -> green (impl done) -> refactoring -> completed
type SubtaskStatus = "pending" | "red" | "green" | "refactoring" | "completed";

// behavioral = changes observable behavior, structural = refactoring only
type SubtaskType = "behavioral" | "structural";

// Commits happen only after tests pass (green/refactoring), never on red
type CommitPhase = "green" | "refactoring";

// When to execute retrospective actions:
//   immediate: Apply within Retrospective (non-production code, single logical change)
//   sprint: Add as subtask to next sprint (process improvements)
//   product: Add as new PBI to Product Backlog (feature additions)
type ImprovementTiming = "immediate" | "sprint" | "product";

type ImprovementStatus = "active" | "completed" | "abandoned";

interface SuccessMetric {
  metric: string;
  target: string;
}

interface ProductGoal {
  statement: string;
  success_metrics: SuccessMetric[];
}

interface AcceptanceCriterion {
  criterion: string;
  verification: string;
}

interface UserStory {
  role: (typeof userStoryRoles)[number];
  capability: string;
  benefit: string;
}

interface PBI {
  id: string;
  story: UserStory;
  acceptance_criteria: AcceptanceCriterion[];
  status: PBIStatus;
}

interface Commit {
  hash: string;
  message: string;
  phase: CommitPhase;
}

interface Subtask {
  test: string;
  implementation: string;
  type: SubtaskType;
  status: SubtaskStatus;
  commits: Commit[];
  notes: string[];
}

interface Sprint {
  number: number;
  pbi_id: string;
  goal: string;
  status: SprintStatus;
  subtasks: Subtask[];
}

interface DoDCheck {
  name: string;
  run: string;
}

interface DefinitionOfDone {
  checks: DoDCheck[];
}

interface Improvement {
  action: string;
  timing: ImprovementTiming;
  status: ImprovementStatus;
  outcome: string | null;
}

interface Retrospective {
  sprint: number;
  improvements: Improvement[];
}

interface ScrumDashboard {
  product_goal: ProductGoal;
  product_backlog: PBI[];
  sprint: Sprint | null;
  definition_of_done: DefinitionOfDone;
  completed: Sprint[];
  retrospectives: Retrospective[];
}

// JSON output (deno run scrum.ts | jq for queries)
console.log(JSON.stringify(scrum, null, 2));
