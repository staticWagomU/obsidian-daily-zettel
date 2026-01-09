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
    { id: "PBI-006", story: { role: "Zettelkasten実践者", capability: "ノート昇格（Fleeting→Permanent等）", benefit: "アイデアを段階的に成熟" }, acceptance_criteria: [{ criterion: "PromoteNoteCommand（PROMOTION_PATHSバリデーション+NoteTypeModal選択）", verification: "コマンド登録・Modal表示確認" }, { criterion: "PromotionService.promoteNote（フロントマター更新：type/promoted_from/promoted_at/tags+フォルダ移動：vault.rename）", verification: "昇格後フロントマター・フォルダ検証" }, { criterion: "昇格不可（literature/index）はModal選択肢非表示、空PROMOTION_PATHSはNotice警告", verification: "バリデーションエラーハンドリング" }], status: "ready" },
    { id: "PBI-007", story: { role: "Zettelkasten実践者", capability: "PermanentをStructureに接続", benefit: "知識ネットワーク構築" }, acceptance_criteria: [{ criterion: "ConnectionManager+SuggestionService+Modal", verification: "双方向リンク確認" }], status: "draft" },
    // Phase 3: 可視化
    { id: "PBI-008", story: { role: "Zettelkasten実践者", capability: "孤立Permanent Note発見", benefit: "Structure接続漏れ防止" }, acceptance_criteria: [{ criterion: "OrphanDetector+View+接続ボタン", verification: "サイドバー表示確認" }], status: "draft" },
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
    { number: 4, pbi_id: "PBI-004", goal: "テンプレートノート作成", status: "done", subtasks: [{ test: "TemplateService+5templates", implementation: "src/services/template-service.ts,Templates/", type: "behavioral", status: "completed", commits: [{ hash: "275b08c", message: "feat: TemplateService", phase: "green" }, { hash: "7813d8b", message: "fix: TFile型ガード", phase: "green" }], notes: [] }] },
    { number: 5, pbi_id: "PBI-005", goal: "設定タブUI実装", status: "done", subtasks: [{ test: "SettingTab+永続化", implementation: "src/settings.ts", type: "behavioral", status: "completed", commits: [{ hash: "34e5338", message: "feat: SettingTab", phase: "green" }], notes: [] }] },
  ],

  retrospectives: [
    { sprint: 1, improvements: [{ action: "スプリント開始時DoD検証", timing: "sprint", status: "completed", outcome: "Sprint2適用" }, { action: "サンプルコード品質独立化", timing: "product", status: "active", outcome: null }] },
    { sprint: 2, improvements: [{ action: "サブタスク小分割", timing: "sprint", status: "completed", outcome: "Sprint3適用" }, { action: "AC振る舞い視点記述", timing: "sprint", status: "completed", outcome: "Sprint3適用" }] },
    { sprint: 3, improvements: [{ action: "サブタスク=コミット単位", timing: "sprint", status: "completed", outcome: "Sprint4で有効確認" }, { action: "複数ファイル=1サブタスク", timing: "sprint", status: "completed", outcome: "Sprint4で有効確認" }] },
    { sprint: 4, improvements: [{ action: "ACファイル名と実装整合性確認", timing: "sprint", status: "completed", outcome: "Sprint5で整合性維持確認" }, { action: "サブタスクnotesを事前計画に活用", timing: "sprint", status: "abandoned", outcome: "AC詳細化の方が効果的と判明" }] },
    { sprint: 5, improvements: [{ action: "AC粒度標準化（1AC=1論理グループ）", timing: "sprint", status: "active", outcome: null }, { action: "notes=実装時記録専用、計画はAC内記述", timing: "immediate", status: "completed", outcome: "Sprint5 Retro適用" }] },
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
