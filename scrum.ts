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
    // Phase 1: 基盤構築
    {
      id: "PBI-001",
      story: {
        role: "Zettelkasten実践者",
        capability: "ノートタイプ（Fleeting/Literature/Permanent/Structure/Index）を識別できる",
        benefit: "5種類のノートを適切に分類・管理できる",
      },
      acceptance_criteria: [
        { criterion: "NoteType型が5種類を網羅", verification: "pnpm build が成功" },
        { criterion: "NOTE_TYPE_CONFIGが各タイプの設定を持つ", verification: "型チェック通過" },
        { criterion: "PROMOTION_PATHSで昇格パスが定義", verification: "fleeting→permanent→structure→indexの流れ" },
      ],
      status: "done",
    },
    {
      id: "PBI-002",
      story: {
        role: "Zettelkasten実践者",
        capability: "フロントマターでノートのメタデータを管理できる",
        benefit: "ノート間の関係性を自動追跡できる",
      },
      acceptance_criteria: [
        { criterion: "addFrontmatter()がYAML文字列を生成", verification: "---で囲まれたフロントマターが先頭に追加される" },
        { criterion: "updateMetadata()で部分更新", verification: "app.fileManager.processFrontMatter経由で既存キー保持" },
        { criterion: "getNoteType()がキャッシュから取得", verification: "metadataCache.getFileCache().frontmatter.type返却" },
        { criterion: "addStructureLink()が重複排除", verification: "structure_notes配列に未追加のリンクのみ追加" },
        { criterion: "updateTags()で追加・削除両対応", verification: "tagsToRemove削除後にtagsToAdd追加し重複排除" },
      ],
      status: "ready",
    },
    {
      id: "PBI-003",
      story: {
        role: "Obsidianモバイルユーザー",
        capability: "選択テキストから新規ノートを作成できる",
        benefit: "デイリーノートから素早くアイデアを切り出せる",
      },
      acceptance_criteria: [
        { criterion: "選択範囲から新規ノート作成", verification: "コマンド実行でノート生成" },
        { criterion: "NoteTypeModalでタイプ選択", verification: "3タイプから選択可能" },
        { criterion: "元ノートにリンク挿入", verification: "設定ONで[[リンク]]置換" },
      ],
      status: "draft",
    },
    {
      id: "PBI-004",
      story: {
        role: "Obsidianモバイルユーザー",
        capability: "テンプレートを使ってノートを作成できる",
        benefit: "一貫したフォーマットでノートを管理できる",
      },
      acceptance_criteria: [
        { criterion: "TemplateServiceで変数展開", verification: "{{title}}等が置換される" },
        { criterion: "5タイプ分のテンプレート", verification: "各テンプレートが存在" },
        { criterion: "日付フォーマット対応", verification: "{{date:YYYY-MM-DD}}が展開" },
      ],
      status: "draft",
    },
    {
      id: "PBI-005",
      story: {
        role: "Obsidianモバイルユーザー",
        capability: "プラグイン設定をカスタマイズできる",
        benefit: "自分のワークフローに合わせて調整できる",
      },
      acceptance_criteria: [
        { criterion: "SettingsTabでUI表示", verification: "設定タブが開ける" },
        { criterion: "フォルダパス変更可能", verification: "5タイプのフォルダ設定" },
        { criterion: "動作設定トグル", verification: "insertLinkAfterExtract等が切替可能" },
      ],
      status: "draft",
    },

    // Phase 2: 接続管理
    {
      id: "PBI-006",
      story: {
        role: "Zettelkasten実践者",
        capability: "ノートを昇格（Fleeting→Permanent等）できる",
        benefit: "アイデアを段階的に成熟させられる",
      },
      acceptance_criteria: [
        { criterion: "promoteNoteコマンド実装", verification: "昇格が実行される" },
        { criterion: "フロントマター更新", verification: "type/promoted_from/promoted_at反映" },
        { criterion: "フォルダ自動移動", verification: "設定ONで対応フォルダへ移動" },
      ],
      status: "draft",
    },
    {
      id: "PBI-007",
      story: {
        role: "Zettelkasten実践者",
        capability: "Permanent NoteをStructure Noteに接続できる",
        benefit: "知識のネットワークを構築できる",
      },
      acceptance_criteria: [
        { criterion: "ConnectionManager実装", verification: "双方向リンク作成" },
        { criterion: "SuggestionServiceで提案", verification: "タグ・タイトルマッチで候補表示" },
        { criterion: "StructureSuggestModal", verification: "選択またはスキップ可能" },
      ],
      status: "draft",
    },

    // Phase 3: 可視化
    {
      id: "PBI-008",
      story: {
        role: "Zettelkasten実践者",
        capability: "孤立したPermanent Noteを発見できる",
        benefit: "Structure Noteへの接続漏れを防げる",
      },
      acceptance_criteria: [
        { criterion: "OrphanDetector実装", verification: "structure_notes空のノート検出" },
        { criterion: "OrphanView表示", verification: "サイドバーに一覧表示" },
        { criterion: "接続ボタン動作", verification: "ワンタップでStructure提案" },
      ],
      status: "draft",
    },
  ],

  sprint: {
    number: 2,
    pbi_id: "PBI-002",
    goal: "FrontmatterServiceを実装し、フロントマターを通じたノートメタデータの管理機能を提供する",
    status: "in_progress",
    subtasks: [
      {
        test: "addFrontmatter()がYAML文字列を生成する",
        implementation: "stringifyYaml()でメタデータをYAML化し---で囲む",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "updateMetadata()が既存フロントマターを保持して部分更新",
        implementation: "app.fileManager.processFrontMatter経由でObject.assign",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "getNoteType()がキャッシュからtype取得",
        implementation: "metadataCache.getFileCache().frontmatter.type返却",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "addStructureLink()が重複排除してリンク追加",
        implementation: "structure_notes配列に未追加のリンクのみpush",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "updateTags()が削除・追加・重複排除を実行",
        implementation: "tagsToRemove削除後にtagsToAdd追加しSet化",
        type: "behavioral",
        status: "pending",
        commits: [],
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
    {
      number: 1,
      pbi_id: "PBI-001",
      goal: "NoteType型定義と設定マップの実装により、5種類のノートタイプを識別可能にする",
      status: "done",
      subtasks: [
        { test: "NoteType型が5種類のユニオン型", implementation: "src/types/note-types.ts", type: "behavioral", status: "completed", commits: [{ hash: "1eb7e33", message: "feat: implement NoteType type system", phase: "green" }], notes: [] },
        { test: "NoteTypeConfig interface", implementation: "6フィールド定義", type: "behavioral", status: "completed", commits: [{ hash: "1eb7e33", message: "feat: implement NoteType type system", phase: "green" }], notes: [] },
        { test: "NOTE_TYPE_CONFIG定数", implementation: "Record<NoteType, NoteTypeConfig>", type: "behavioral", status: "completed", commits: [{ hash: "1eb7e33", message: "feat: implement NoteType type system", phase: "green" }], notes: [] },
        { test: "PROMOTION_PATHS定数", implementation: "fleeting→permanent→structure→index", type: "behavioral", status: "completed", commits: [{ hash: "1eb7e33", message: "feat: implement NoteType type system", phase: "green" }], notes: [] },
        { test: "NoteMetadata interface", implementation: "必須3+オプショナル8フィールド", type: "behavioral", status: "completed", commits: [{ hash: "1eb7e33", message: "feat: implement NoteType type system", phase: "green" }], notes: [] },
        { test: "NoteStatus型", implementation: "'draft'|'reviewed'|'mature'", type: "behavioral", status: "completed", commits: [{ hash: "1eb7e33", message: "feat: implement NoteType type system", phase: "green" }], notes: [] },
        { test: "pnpm build成功", implementation: "src/types/index.ts export", type: "behavioral", status: "completed", commits: [{ hash: "1eb7e33", message: "feat: implement NoteType type system", phase: "green" }], notes: [] },
      ],
    },
  ],

  retrospectives: [
    {
      sprint: 1,
      improvements: [
        { action: "スプリント開始時にlint/build/format検証", timing: "sprint", status: "active", outcome: null },
        { action: "サンプルコード品質管理を独立化", timing: "product", status: "active", outcome: null },
        { action: "eslint.config.mts調整", timing: "immediate", status: "completed", outcome: "scrum.tsをallowDefaultProjectに追加" },
      ],
    },
  ],
};

// ============================================================
// Type Definitions (DO NOT MODIFY - request human review for schema changes)
// ============================================================

// PBI lifecycle: draft (idea) -> refining (gathering info) -> ready (can start) -> done
type PBIStatus = "draft" | "refining" | "ready" | "done";

// Sprint lifecycle
type SprintStatus =
  | "planning"
  | "in_progress"
  | "review"
  | "done"
  | "cancelled";

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
