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
      status: "done",
    },
    {
      id: "PBI-003",
      story: {
        role: "Obsidianモバイルユーザー",
        capability: "選択テキストから新規ノートを作成できる",
        benefit: "デイリーノートから素早くアイデアを切り出せる",
      },
      acceptance_criteria: [
        { criterion: "テキスト選択なしでコマンド実行時、警告通知が表示される", verification: "Notice「テキストを選択してください」表示を確認" },
        { criterion: "テキスト選択後コマンド実行時、NoteTypeModalが開きFleeting/Literature/Permanentの3タイプが選択可能", verification: "モーダルで各タイプのアイコン・ラベル・説明が表示されることを確認" },
        { criterion: "タイプ選択後、選択テキストを本文とする新規ノートが対応フォルダに作成され、フロントマター(type/created/tags/source_notes)が付与される", verification: "作成されたノートのフロントマターとファイルパスを確認" },
        { criterion: "insertLinkAfterExtract設定がONの場合、元ノートの選択範囲が[[新規ノート名]]リンクに置換される", verification: "元ノートのエディタで選択範囲がリンクになっていることを確認" },
        { criterion: "Permanentタイプ選択かつsuggestStructureOnPermanent設定がONの場合、ノート作成後にStructureSuggestModalが開く", verification: "Structure提案モーダルが表示され、スキップまたは選択が可能なことを確認" },
      ],
      status: "ready",
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
    number: 3,
    pbi_id: "PBI-003",
    goal: "選択テキストから3タイプ(Fleeting/Literature/Permanent)のノートを作成し、リンク挿入とStructure提案の自動化により、デイリーノートからのアイデア切り出しワークフローを実現する",
    status: "in_progress",
    subtasks: [
      // AC1: エラーハンドリング (テキスト選択なしで警告通知)
      {
        test: "ExtractSelectionCommand: 選択テキスト空でNotice表示",
        implementation: "src/commands/ExtractSelectionCommand.ts - extractSelection() エラーハンドリング部分",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },

      // AC2: NoteTypeModal (3タイプ選択UI)
      {
        test: "NoteTypeModal: getItems()でFleeting/Literature/Permanentの3タイプ返却",
        implementation: "src/ui/modals/NoteTypeModal.ts - constructor, getItems()",
        type: "behavioral",
        status: "completed",
        commits: [{ hash: "", message: "feat: implement NoteTypeModal with all UI methods", phase: "green" }],
        notes: [],
      },
      {
        test: "NoteTypeModal: getItemText()でアイコン付きラベル返却",
        implementation: "src/ui/modals/NoteTypeModal.ts - getItemText()",
        type: "behavioral",
        status: "completed",
        commits: [{ hash: "", message: "feat: implement NoteTypeModal with all UI methods", phase: "green" }],
        notes: [],
      },
      {
        test: "NoteTypeModal: renderSuggestion()でアイコン・ラベル・説明を表示",
        implementation: "src/ui/modals/NoteTypeModal.ts - renderSuggestion()",
        type: "behavioral",
        status: "completed",
        commits: [{ hash: "", message: "feat: implement NoteTypeModal with all UI methods", phase: "green" }],
        notes: [],
      },
      {
        test: "NoteTypeModal: onChooseItem()でコールバック実行",
        implementation: "src/ui/modals/NoteTypeModal.ts - onChooseItem()",
        type: "behavioral",
        status: "completed",
        commits: [{ hash: "", message: "feat: implement NoteTypeModal with all UI methods", phase: "green" }],
        notes: [],
      },

      // AC3: ノート作成 (フォルダ配置+フロントマター)
      {
        test: "ExtractSelectionCommand: NoteTypeModal呼び出しとコールバック設定",
        implementation: "src/commands/ExtractSelectionCommand.ts - extractSelection() モーダル呼び出し部分",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "ExtractSelectionCommand: createNoteFromSelection()でタイトル生成",
        implementation: "src/commands/ExtractSelectionCommand.ts - createNoteFromSelection() タイトル生成部分",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "ExtractSelectionCommand: NoteManager.createNote()呼び出し",
        implementation: "src/commands/ExtractSelectionCommand.ts - createNoteFromSelection() ノート作成部分",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "NoteManager.createNote()でフォルダ確保、ファイル名生成、メタデータ構築、ファイル作成",
        implementation: "src/core/NoteManager.ts - createNote()",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },

      // AC4: リンク挿入 (設定ON時に[[リンク]]置換)
      {
        test: "ExtractSelectionCommand: insertLinkAfterExtract設定確認とリンク挿入",
        implementation: "src/commands/ExtractSelectionCommand.ts - createNoteFromSelection() リンク挿入部分",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },

      // AC5: Structure提案 (Permanent+設定ON時にモーダル)
      {
        test: "ExtractSelectionCommand: Permanent選択時のStructureSuggestModal呼び出し条件判定",
        implementation: "src/commands/ExtractSelectionCommand.ts - createNoteFromSelection() Structure提案部分",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "StructureSuggestModal: suggestStructureNotes()呼び出しと提案読み込み",
        implementation: "src/ui/modals/StructureSuggestModal.ts - constructor, loadSuggestions()",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "StructureSuggestModal: getItems()でスキップオプション+提案リスト返却",
        implementation: "src/ui/modals/StructureSuggestModal.ts - getItems()",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "StructureSuggestModal: renderSuggestion()でアイコン・ラベル表示",
        implementation: "src/ui/modals/StructureSuggestModal.ts - renderSuggestion()",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "StructureSuggestModal: onChooseItem()でスキップまたは選択時の処理",
        implementation: "src/ui/modals/StructureSuggestModal.ts - onChooseItem()",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },

      // 統合とビルド検証
      {
        test: "ExtractSelectionCommand: 新規ノートを開く処理",
        implementation: "src/commands/ExtractSelectionCommand.ts - createNoteFromSelection() ノートオープン部分",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "commands/index.ts: ExtractSelectionCommandをコマンド登録",
        implementation: "src/commands/index.ts - registerCommands()",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "pnpm build が成功し、すべての受け入れ基準を満たす",
        implementation: "ビルド検証とE2Eテスト",
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
        { test: "NoteType/Config/Metadata/Status型、NOTE_TYPE_CONFIG/PROMOTION_PATHS定数、pnpm build", implementation: "src/types/note-types.ts", type: "behavioral", status: "completed", commits: [{ hash: "1eb7e33", message: "feat: implement NoteType type system", phase: "green" }], notes: [] },
      ],
    },
    {
      number: 2,
      pbi_id: "PBI-002",
      goal: "FrontmatterServiceを実装し、フロントマターを通じたノートメタデータの管理機能を提供する",
      status: "done",
      subtasks: [
        { test: "addFrontmatter/updateMetadata/getNoteType/addStructureLink/updateTags", implementation: "src/services/frontmatter-service.ts", type: "behavioral", status: "completed", commits: [{ hash: "0268c21", message: "feat: implement FrontmatterService with all 5 methods", phase: "green" }], notes: [] },
      ],
    },
  ],

  retrospectives: [
    {
      sprint: 1,
      improvements: [
        { action: "スプリント開始時にlint/build/format検証", timing: "sprint", status: "completed", outcome: "Sprint 2開始時に適用済み" },
        { action: "サンプルコード品質管理を独立化", timing: "product", status: "active", outcome: null },
        { action: "eslint.config.mts調整", timing: "immediate", status: "completed", outcome: "scrum.tsをallowDefaultProjectに追加" },
      ],
    },
    {
      sprint: 2,
      improvements: [
        { action: "サブタスクをより小さく分割（1メソッド=1コミット粒度）", timing: "sprint", status: "active", outcome: null },
        { action: "受け入れ基準を振る舞い視点で記述", timing: "sprint", status: "active", outcome: null },
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
