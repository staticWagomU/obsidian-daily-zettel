// ============================================================
// Dashboard Data (AI edits this section)
// ============================================================

const userStoryRoles = ["Obsidianモバイルユーザー", "Zettelkasten実践者", "Obsidianユーザー"] as const satisfies readonly string[];

const scrum: ScrumDashboard = {
  product_goal: {
    statement: "Zettelkasten方式でアイデアを効率的に記録・整理し、知識のネットワークを構築できるようにする",
    success_metrics: [{ metric: "ノート作成の操作ステップ数", target: "3ステップ以内" }, { metric: "コマンド実行からノート作成完了まで", target: "5秒以内" }],
  },

  product_backlog: [
    // Phase 1-7: done (PBI-001〜016)
    { id: "PBI-001", story: { role: "Zettelkasten実践者", capability: "ノートタイプを識別できる", benefit: "分類・管理" }, acceptance_criteria: [{ criterion: "NoteType型+CONFIG", verification: "build" }], status: "done" },
    { id: "PBI-002", story: { role: "Zettelkasten実践者", capability: "フロントマターでメタデータ管理", benefit: "関係性追跡" }, acceptance_criteria: [{ criterion: "5メソッド", verification: "実装" }], status: "done" },
    { id: "PBI-003", story: { role: "Obsidianモバイルユーザー", capability: "選択テキストから新規ノート作成", benefit: "アイデア切り出し" }, acceptance_criteria: [{ criterion: "Modal+リンク置換", verification: "E2E" }], status: "done" },
    { id: "PBI-004", story: { role: "Obsidianモバイルユーザー", capability: "テンプレートでノート作成", benefit: "フォーマット管理" }, acceptance_criteria: [{ criterion: "変数展開", verification: "Templates存在" }], status: "done" },
    { id: "PBI-005", story: { role: "Obsidianモバイルユーザー", capability: "プラグイン設定カスタマイズ", benefit: "ワークフロー調整" }, acceptance_criteria: [{ criterion: "設定UI+永続化", verification: "保持確認" }], status: "done" },
    { id: "PBI-006", story: { role: "Zettelkasten実践者", capability: "ノート昇格", benefit: "段階的成熟" }, acceptance_criteria: [{ criterion: "PromotionService", verification: "昇格確認" }], status: "done" },
    { id: "PBI-007", story: { role: "Zettelkasten実践者", capability: "Permanent-Structure接続", benefit: "ネットワーク構築" }, acceptance_criteria: [{ criterion: "ConnectionManager", verification: "双方向リンク" }], status: "done" },
    { id: "PBI-008", story: { role: "Zettelkasten実践者", capability: "孤立Permanent発見", benefit: "接続漏れ防止" }, acceptance_criteria: [{ criterion: "OrphanView", verification: "リスト表示" }], status: "done" },
    { id: "PBI-009", story: { role: "Obsidianモバイルユーザー", capability: "ワンタップFleeting作成", benefit: "素早くキャプチャ" }, acceptance_criteria: [{ criterion: "QuickCaptureModal", verification: "E2E" }], status: "done" },
    { id: "PBI-010", story: { role: "Zettelkasten実践者", capability: "フォルダ自動生成", benefit: "手動作成不要" }, acceptance_criteria: [{ criterion: "initializeAllFolders", verification: "フォルダ存在" }], status: "done" },
    { id: "PBI-011", story: { role: "Zettelkasten実践者", capability: "接続率統計", benefit: "健全性把握" }, acceptance_criteria: [{ criterion: "getStats", verification: "UI表示" }], status: "done" },
    { id: "PBI-012", story: { role: "Zettelkasten実践者", capability: "フォルダサジェスト", benefit: "タイポ防止" }, acceptance_criteria: [{ criterion: "FolderSuggest", verification: "dropdown" }], status: "done" },
    { id: "PBI-013", story: { role: "Obsidianモバイルユーザー", capability: "コンテキストメニュー操作", benefit: "素早くアクセス" }, acceptance_criteria: [{ criterion: "editor-menu/file-menu", verification: "メニュー表示" }], status: "done" },
    { id: "PBI-014", story: { role: "Obsidianモバイルユーザー", capability: "i18n対応", benefit: "自然なUI" }, acceptance_criteria: [{ criterion: "t()関数+翻訳JSON", verification: "言語切替" }], status: "done" },
    { id: "PBI-015", story: { role: "Obsidianモバイルユーザー", capability: "メニューグルーピング", benefit: "操作性向上" }, acceptance_criteria: [{ criterion: "setSection", verification: "セパレーター" }], status: "done" },
    { id: "PBI-016", story: { role: "Obsidianユーザー", capability: "3ノートタイプ化", benefit: "シンプル化" }, acceptance_criteria: [{ criterion: "Structure/Index削除", verification: "grep+build" }], status: "done" },
    // Phase: 新設計リファクタリング (DESIGN.md準拠)
    { id: "PBI-017", story: { role: "Obsidianユーザー", capability: "設定画面で各ノートタイプのフォルダ・ファイル名形式・テンプレートを設定できる", benefit: "自分のワークフローに合わせたZettelkasten環境を構築できる" }, acceptance_criteria: [{ criterion: "NoteTypeSettings型定義(fileNameFormat/showAliasInput/templatePath/folder)", verification: "types/settings.ts" }, { criterion: "PageZettelSettings拡張+DEFAULT_SETTINGS", verification: "settings.ts" }, { criterion: "3ノートタイプ×設定UI(各4項目)", verification: "設定画面表示" }, { criterion: "設定永続化", verification: "data.json保存確認" }], status: "ready" },
    { id: "PBI-018", story: { role: "Obsidianユーザー", capability: "NoteTypeSelectModalとAliasInputModalでノート作成フローを統一できる", benefit: "一貫したUI体験" }, acceptance_criteria: [{ criterion: "NoteTypeSelectModal 3種類", verification: "モーダル確認" }, { criterion: "AliasInputModal+インデント削除", verification: "DESIGN.md通り" }, { criterion: "設定連動", verification: "表示制御確認" }], status: "draft" },
    { id: "PBI-019", story: { role: "Obsidianユーザー", capability: "TemplateServiceでプレースホルダーを展開", benefit: "一貫したフォーマット" }, acceptance_criteria: [{ criterion: "{{content}}", verification: "Extract/Create" }, { criterion: "{{date}}{{time}}{{datetime}}", verification: "日時展開" }, { criterion: "{{title}}{{alias}}", verification: "タイトル展開" }, { criterion: "フォールバック", verification: "空テンプレート" }], status: "draft" },
    { id: "PBI-020", story: { role: "Obsidianユーザー", capability: "NoteCreatorServiceでノート作成統一", benefit: "コード重複防止" }, acceptance_criteria: [{ criterion: "createNote(type,content,alias)", verification: "サービス実装" }, { criterion: "ファイル名形式", verification: "設定連動" }, { criterion: "フォルダ配置", verification: "設定連動" }, { criterion: "TemplateService統合", verification: "テンプレート適用" }], status: "draft" },
    { id: "PBI-021", story: { role: "Obsidianユーザー", capability: "Create New Noteコマンド", benefit: "素早く記録開始" }, acceptance_criteria: [{ criterion: "コマンド登録", verification: "パレット表示" }, { criterion: "Modal→作成→オープン", verification: "E2E" }, { criterion: "NoteCreatorService統合", verification: "サービス経由" }], status: "draft" },
    { id: "PBI-022", story: { role: "Obsidianユーザー", capability: "Extract to Note", benefit: "アトミックノート抽出" }, acceptance_criteria: [{ criterion: "コマンド登録", verification: "パレット表示" }, { criterion: "{{content}}挿入", verification: "テンプレート展開" }, { criterion: "リンク置換", verification: "[alias](path)" }, { criterion: "インデント削除", verification: "チェックボックス" }, { criterion: "Extract後オープン", verification: "設定連動" }], status: "draft" },
    { id: "PBI-023", story: { role: "Obsidianユーザー", capability: "孤立Permanent検出(リンクベース)", benefit: "ネットワーク統合" }, acceptance_criteria: [{ criterion: "マークダウンリンク検出", verification: "リンクベース" }, { criterion: "接続機能削除", verification: "ボタン非表示" }, { criterion: "ノートを開く", verification: "クリック遷移" }], status: "draft" },
    { id: "PBI-024", story: { role: "Obsidianユーザー", capability: "コンテキストメニューExtract", benefit: "右クリックアクセス" }, acceptance_criteria: [{ criterion: "メニュー表示", verification: "選択時のみ" }, { criterion: "コマンド実行", verification: "E2E" }, { criterion: "ON/OFF設定", verification: "設定連動" }], status: "draft" },
  ],

  sprint: {
    number: 17,
    pbi_id: "PBI-017",
    goal: "各ノートタイプのフォルダ・ファイル名形式・テンプレート設定機能",
    status: "in_progress",
    subtasks: [
      {
        test: "NoteTypeSettings型定義(folder/fileNameFormat/showAliasInput/templatePath)",
        implementation: "types/settings.ts",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "PageZettelSettings拡張(fleeting/literature/permanent)+DEFAULT_SETTINGS",
        implementation: "settings.ts",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "Fleeting設定UI(folder/fileNameFormat/showAliasInput/templatePath)",
        implementation: "settings.ts",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "Literature設定UI(folder/fileNameFormat/showAliasInput/templatePath)",
        implementation: "settings.ts",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "Permanent設定UI(folder/fileNameFormat/showAliasInput/templatePath)",
        implementation: "settings.ts",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "設定永続化検証(data.json保存+再読み込み)",
        implementation: "main.ts",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
    ],
  },

  definition_of_done: { checks: [{ name: "Build passes", run: "pnpm build" }, { name: "Lint passes", run: "pnpm lint" }, { name: "Format check passes", run: "pnpm format:check" }] },

  completed: [
    { number: 1, pbi_id: "PBI-001", goal: "NoteType型定義", status: "done", subtasks: [{ test: "型+定数", implementation: "types/note-types.ts", type: "behavioral", status: "completed", commits: [{ hash: "1eb7e33", message: "feat: NoteType system", phase: "green" }], notes: [] }] },
    { number: 2, pbi_id: "PBI-002", goal: "FrontmatterService", status: "done", subtasks: [{ test: "5メソッド", implementation: "services/frontmatter-service.ts", type: "behavioral", status: "completed", commits: [{ hash: "0268c21", message: "feat: FrontmatterService", phase: "green" }], notes: [] }] },
    { number: 3, pbi_id: "PBI-003", goal: "選択テキスト→ノート", status: "done", subtasks: [{ test: "Command+Modal", implementation: "commands/,ui/modals/", type: "behavioral", status: "completed", commits: [{ hash: "527d854", message: "feat: ExtractSelection", phase: "green" }], notes: [] }] },
    { number: 4, pbi_id: "PBI-004", goal: "テンプレートノート作成", status: "done", subtasks: [{ test: "TemplateService", implementation: "services/template-service.ts", type: "behavioral", status: "completed", commits: [{ hash: "275b08c", message: "feat: TemplateService", phase: "green" }], notes: [] }] },
    { number: 5, pbi_id: "PBI-005", goal: "設定タブUI実装", status: "done", subtasks: [{ test: "SettingTab+永続化", implementation: "settings.ts", type: "behavioral", status: "completed", commits: [{ hash: "34e5338", message: "feat: SettingTab", phase: "green" }], notes: [] }] },
    { number: 6, pbi_id: "PBI-006", goal: "ノート昇格機能", status: "done", subtasks: [{ test: "PromotionService+Command", implementation: "services/promotion-service.ts,commands/promote-note-command.ts", type: "behavioral", status: "completed", commits: [{ hash: "ca4d202", message: "feat: PromotionService", phase: "green" }, { hash: "7ee7498", message: "feat: PromoteNoteCommand", phase: "green" }], notes: [] }] },
    { number: 7, pbi_id: "PBI-007", goal: "Permanent-Structure接続", status: "done", subtasks: [{ test: "ConnectionManager+LinkCommand", implementation: "core/connection-manager.ts,commands/link-permanent-command.ts", type: "behavioral", status: "completed", commits: [{ hash: "67af70b", message: "feat: ConnectionManager", phase: "green" }, { hash: "fb76382", message: "feat: LinkPermanentCommand", phase: "green" }], notes: [] }] },
    { number: 8, pbi_id: "PBI-008", goal: "孤立Permanent発見", status: "done", subtasks: [{ test: "OrphanDetector+View", implementation: "services/orphan-detector-service.ts,ui/views/orphan-view.ts", type: "behavioral", status: "completed", commits: [{ hash: "af1660f", message: "feat: OrphanDetectorService", phase: "green" }, { hash: "b775960", message: "feat: OrphanView", phase: "green" }], notes: [] }] },
    { number: 9, pbi_id: "PBI-011", goal: "接続率統計表示", status: "done", subtasks: [{ test: "getStats+UI", implementation: "services/orphan-detector-service.ts,ui/views/orphan-view.ts", type: "behavioral", status: "completed", commits: [{ hash: "151f9ac", message: "feat: getStats()", phase: "green" }], notes: [] }] },
    { number: 10, pbi_id: "PBI-009", goal: "ワンタップFleeting", status: "done", subtasks: [{ test: "QuickCaptureModal+コマンド", implementation: "ui/modals/quick-capture-modal.ts,main.ts", type: "behavioral", status: "completed", commits: [{ hash: "3df2861", message: "feat: QuickCaptureModal", phase: "green" }], notes: [] }] },
    { number: 11, pbi_id: "PBI-010", goal: "フォルダ自動生成", status: "done", subtasks: [{ test: "initializeAllFolders", implementation: "services/folder-service.ts,main.ts", type: "behavioral", status: "completed", commits: [{ hash: "6562f6c", message: "feat: auto folder init", phase: "green" }], notes: [] }] },
    { number: 12, pbi_id: "PBI-012", goal: "FolderSuggest", status: "done", subtasks: [{ test: "AbstractInputSuggest継承", implementation: "ui/suggesters/folder-suggest.ts,settings.ts", type: "behavioral", status: "completed", commits: [{ hash: "2c1069c", message: "feat: FolderSuggest", phase: "green" }], notes: [] }] },
    { number: 13, pbi_id: "PBI-013", goal: "コンテキストメニュー", status: "done", subtasks: [{ test: "editor-menu/file-menu", implementation: "main.ts,settings.ts", type: "behavioral", status: "completed", commits: [{ hash: "31a755d", message: "feat: context menu", phase: "green" }], notes: [] }] },
    { number: 14, pbi_id: "PBI-015", goal: "メニューグルーピング", status: "done", subtasks: [{ test: "setSection+addSeparator", implementation: "main.ts", type: "behavioral", status: "completed", commits: [{ hash: "8df2157", message: "feat: menu grouping", phase: "green" }], notes: [] }] },
    { number: 15, pbi_id: "PBI-014", goal: "i18n国際化", status: "done", subtasks: [{ test: "t()+翻訳JSON", implementation: "i18n/,main.ts,settings.ts", type: "behavioral", status: "completed", commits: [{ hash: "65d7639", message: "feat: i18n", phase: "green" }], notes: [] }] },
    { number: 16, pbi_id: "PBI-016", goal: "3ノートタイプ化", status: "done", subtasks: [{ test: "Structure/Index削除", implementation: "4ファイル削除+10ファイル更新", type: "structural", status: "completed", commits: [{ hash: "f72e1d8", message: "refactor: remove Structure files", phase: "green" }, { hash: "c26fa4a", message: "refactor: fix build", phase: "green" }], notes: [] }] },
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
    { sprint: 9, improvements: [{ action: "既存実装拡張パターン継続", timing: "sprint", status: "completed", outcome: "getStats+UI統合成功" }] },
    { sprint: 10, improvements: [{ action: "Modal実装前に既存Modal調査必須化", timing: "sprint", status: "completed", outcome: "Sprint11でModal不使用" }] },
    { sprint: 11, improvements: [{ action: "既存Service活用を実装前調査で確認", timing: "sprint", status: "completed", outcome: "Sprint12でAbstractInputSuggest活用" }] },
    { sprint: 12, improvements: [{ action: "Obsidian API継承パターン活用継続", timing: "sprint", status: "completed", outcome: "Sprint13でworkspace events適用" }] },
    { sprint: 13, improvements: [{ action: "型定義事前確認継続", timing: "sprint", status: "completed", outcome: "Sprint14でsetSection採用" }] },
    { sprint: 14, improvements: [{ action: "obsidian.d.ts確認必須化", timing: "sprint", status: "completed", outcome: "Sprint15でgetLanguage活用" }] },
    { sprint: 15, improvements: [{ action: "tsconfig.json更新確認", timing: "sprint", status: "active", outcome: null }] },
    { sprint: 16, improvements: [{ action: "大規模削除時grep網羅性向上", timing: "sprint", status: "active", outcome: null }, { action: "型依存関係の明示的リストアップ", timing: "sprint", status: "active", outcome: "PBI-017 Refinementで適用: NoteTypeSettings新規→PageZettelSettings拡張→settings.ts→main.ts" }] },
  ],
};

// ============================================================
// Type Definitions (DO NOT MODIFY)
// ============================================================
type PBIStatus = "draft" | "refining" | "ready" | "done";
type SprintStatus = "planning" | "in_progress" | "review" | "done" | "cancelled";
type SubtaskStatus = "pending" | "red" | "green" | "refactoring" | "completed";
type SubtaskType = "behavioral" | "structural";
type CommitPhase = "green" | "refactoring";
type ImprovementTiming = "immediate" | "sprint" | "product";
type ImprovementStatus = "active" | "completed" | "abandoned";
interface SuccessMetric { metric: string; target: string; }
interface ProductGoal { statement: string; success_metrics: SuccessMetric[]; }
interface AcceptanceCriterion { criterion: string; verification: string; }
interface UserStory { role: (typeof userStoryRoles)[number]; capability: string; benefit: string; }
interface PBI { id: string; story: UserStory; acceptance_criteria: AcceptanceCriterion[]; status: PBIStatus; }
interface Commit { hash: string; message: string; phase: CommitPhase; }
interface Subtask { test: string; implementation: string; type: SubtaskType; status: SubtaskStatus; commits: Commit[]; notes: string[]; }
interface Sprint { number: number; pbi_id: string; goal: string; status: SprintStatus; subtasks: Subtask[]; }
interface DoDCheck { name: string; run: string; }
interface DefinitionOfDone { checks: DoDCheck[]; }
interface Improvement { action: string; timing: ImprovementTiming; status: ImprovementStatus; outcome: string | null; }
interface Retrospective { sprint: number; improvements: Improvement[]; }
interface ScrumDashboard { product_goal: ProductGoal; product_backlog: PBI[]; sprint: Sprint | null; definition_of_done: DefinitionOfDone; completed: Sprint[]; retrospectives: Retrospective[]; }

console.log(JSON.stringify(scrum, null, 2));
