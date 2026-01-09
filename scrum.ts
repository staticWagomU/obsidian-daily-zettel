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
    { id: "PBI-008", story: { role: "Zettelkasten実践者", capability: "孤立Permanent Note発見", benefit: "Structure接続漏れ防止" }, acceptance_criteria: [{ criterion: "OrphanDetectorService.getOrphanPermanentNotes()（type=permanent && structure_notes空/未定義のTFile配列を返す）", verification: "FrontmatterService統合、孤立ノート取得確認" }, { criterion: "OrphanView extends ItemView（サイドバー登録、リスト表示、リフレッシュボタン、OrphanDetectorService呼び出し）", verification: "サイドバーアイコンクリック→孤立ノートリスト表示" }, { criterion: "各リストアイテムに接続ボタン（クリックでStructureSuggestModal起動、接続後ビュー自動更新）", verification: "ボタンクリック→Modal表示→接続完了後リストから削除" }], status: "ready" },
  ],

  sprint: {
    number: 8,
    pbi_id: "PBI-008",
    goal: "孤立Permanent Note発見機能実装",
    status: "in_progress",
    subtasks: [
      {
        test: "OrphanDetectorService.getOrphanPermanentNotes()（type=permanent && structure_notes空/未定義のTFile配列取得、FrontmatterService統合）",
        implementation: "src/services/orphan-detector-service.ts",
        type: "behavioral",
        status: "completed",
        commits: [{ hash: "af1660f", message: "feat(PBI-008): implement OrphanDetectorService.getOrphanPermanentNotes()", phase: "green" }],
        notes: [],
      },
      {
        test: "OrphanView extends ItemView（サイドバー登録、リスト表示、リフレッシュボタン、OrphanDetectorService呼び出し）",
        implementation: "src/ui/views/orphan-view.ts",
        type: "behavioral",
        status: "completed",
        commits: [{ hash: "b775960", message: "feat(PBI-008): implement OrphanView extends ItemView", phase: "green" }],
        notes: [],
      },
      {
        test: "各リストアイテムに接続ボタン（クリックでStructureSuggestModal起動、ConnectionManager経由接続、接続後ビュー自動更新）",
        implementation: "src/ui/views/orphan-view.ts",
        type: "behavioral",
        status: "completed",
        commits: [{ hash: "89e632f", message: "feat(PBI-008): integrate connection button to OrphanView", phase: "green" }],
        notes: [],
      },
    ],
  },

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
    { number: 6, pbi_id: "PBI-006", goal: "ノート昇格機能実装", status: "done", subtasks: [{ test: "PromotionService.promoteNote（フロントマター更新：type/promoted_from/promoted_at/tags追加、vault.rename()でフォルダ移動）", implementation: "src/services/promotion-service.ts", type: "behavioral", status: "completed", commits: [{ hash: "ca4d202", message: "feat(PBI-006): implement PromotionService with frontmatter update and folder move", phase: "green" }], notes: [] }, { test: "PromoteNoteCommand（現在のノートtypeから昇格可能タイプ取得→NoteTypeModal表示→PromotionService呼び出し、空PROMOTION_PATHSはNotice警告）", implementation: "src/commands/promote-note-command.ts", type: "behavioral", status: "completed", commits: [{ hash: "7ee7498", message: "feat(PBI-006): implement PromoteNoteCommand with validation and modal", phase: "green" }], notes: [] }, { test: "main.ts統合（コマンド登録、昇格不可タイプ（literature/index）はModal選択肢から除外）", implementation: "src/main.ts,src/ui/modals/note-type-modal.ts", type: "behavioral", status: "completed", commits: [{ hash: "2386b15", message: "feat(PBI-006): integrate promote-note command into main.ts", phase: "green" }], notes: ["NoteTypeModalは既存のallowedTypesパラメータでModal選択肢を制御済み"] }] },
    { number: 7, pbi_id: "PBI-007", goal: "Permanent-Structure接続機能実装", status: "done", subtasks: [{ test: "ConnectionManager.linkPermanentToStructure（Permanentフロントマターにstructure_notes追加+Structureノート本文の「## 関連ノート」セクションにリンク追加）", implementation: "src/core/connection-manager.ts", type: "behavioral", status: "completed", commits: [{ hash: "67af70b", message: "feat: StructureSuggestModal+ConnectionManager", phase: "green" }], notes: ["ConnectionManager+StructureSuggestModal already implemented in Sprint 3"] }, { test: "LinkPermanentCommand（現在ノートがpermanent type確認→StructureSuggestModal表示→ConnectionManager呼び出し）", implementation: "src/commands/link-permanent-command.ts", type: "behavioral", status: "completed", commits: [{ hash: "fb76382", message: "feat(PBI-007): implement LinkPermanentCommand", phase: "green" }, { hash: "5ef875b", message: "feat(PBI-007): register link-permanent command in main.ts", phase: "green" }], notes: [] }, { test: "StructureSuggestModal統合（SuggestionService提案表示+Skipオプション+選択時ConnectionManager経由接続）", implementation: "src/ui/modals/structure-suggest-modal.ts", type: "behavioral", status: "completed", commits: [{ hash: "67af70b", message: "feat: StructureSuggestModal+ConnectionManager", phase: "green" }], notes: ["StructureSuggestModal already integrated with SuggestionService"] }] },
  ],

  retrospectives: [
    { sprint: 1, improvements: [{ action: "スプリント開始時DoD検証", timing: "sprint", status: "completed", outcome: "Sprint2適用" }, { action: "サンプルコード品質独立化", timing: "product", status: "active", outcome: null }] },
    { sprint: 2, improvements: [{ action: "サブタスク小分割", timing: "sprint", status: "completed", outcome: "Sprint3適用" }, { action: "AC振る舞い視点記述", timing: "sprint", status: "completed", outcome: "Sprint3適用" }] },
    { sprint: 3, improvements: [{ action: "サブタスク=コミット単位", timing: "sprint", status: "completed", outcome: "Sprint4で有効確認" }, { action: "複数ファイル=1サブタスク", timing: "sprint", status: "completed", outcome: "Sprint4で有効確認" }] },
    { sprint: 4, improvements: [{ action: "ACファイル名と実装整合性確認", timing: "sprint", status: "completed", outcome: "Sprint5で整合性維持確認" }, { action: "サブタスクnotesを事前計画に活用", timing: "sprint", status: "abandoned", outcome: "AC詳細化の方が効果的と判明" }] },
    { sprint: 5, improvements: [{ action: "AC粒度標準化（1AC=1論理グループ）", timing: "sprint", status: "completed", outcome: "Sprint6で3AC=3サブタスク=3コミット達成" }, { action: "notes=実装時記録専用、計画はAC内記述", timing: "immediate", status: "completed", outcome: "Sprint5 Retro適用" }] },
    { sprint: 6, improvements: [{ action: "AC順序=実装依存関係順に統一（1st AC先頭に依存関係明記）", timing: "sprint", status: "completed", outcome: "Sprint7で3AC順次実装成功、依存関係明確化" }, { action: "AC詳細度基準：criterion=外部仕様(What)、verification=検証方法、notes=内部実装判断", timing: "sprint", status: "completed", outcome: "Sprint7でAC外部仕様記述維持確認" }] },
    { sprint: 7, improvements: [{ action: "Sprint Planning時に既存実装検索必須化（Grep/Globで関連クラス名検索→再利用可能コード特定）", timing: "sprint", status: "active", outcome: null }, { action: "新PBI計画時にcompleted配列のsubtasks[].notes全検索（関連実装存在確認でPBI重複回避）", timing: "sprint", status: "active", outcome: null }] },
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
