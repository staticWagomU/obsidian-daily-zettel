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
    { sprint: 10, improvements: [{ action: "Modal実装前に既存Modal調査を必須化", timing: "sprint", status: "active", outcome: null }] },
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
