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
      status: "done",
    },
    {
      id: "PBI-004",
      story: {
        role: "Obsidianモバイルユーザー",
        capability: "テンプレートを使ってノートを作成できる",
        benefit: "一貫したフォーマットでノートを管理できる",
      },
      acceptance_criteria: [
        { criterion: "TemplateService.getProcessedTemplate()がテンプレートファイルを読み込み、変数を展開して返す", verification: "{{title}}が実際のタイトルに、{{content}}が本文に置換されたテンプレート文字列が返る" },
        { criterion: "日付変数{{date:FORMAT}}が指定フォーマットで展開される", verification: "{{date:YYYY-MM-DD}}が2026-01-09形式に、{{date:YYYY}}が2026に置換される" },
        { criterion: "5タイプ(fleeting/literature/permanent/structure/index)それぞれのテンプレートファイルが存在し、対応する構造を持つ", verification: "Templates/フォルダ内に各テンプレートファイルが存在し、タイプ固有のセクション(例: Literature=出典情報、Permanent=主張)を含む" },
        { criterion: "テンプレートが存在しない場合、デフォルトでcontentを返す", verification: "テンプレートファイル欠損時にgetProcessedTemplate()がvariables.contentをフォールバック値として返す" },
      ],
      status: "done",
    },
    {
      id: "PBI-005",
      story: {
        role: "Obsidianモバイルユーザー",
        capability: "プラグイン設定をカスタマイズできる",
        benefit: "自分のワークフローに合わせて調整できる",
      },
      acceptance_criteria: [
        { criterion: "DailyZettelSettingTab.display()が設定画面をレンダリングし、3つのセクション(フォルダ設定/動作設定/UI設定)見出しが表示される", verification: "containerEl.createEl('h2', {text: 'フォルダ設定'})等で各セクション見出しが作成されることを確認" },
        { criterion: "フォルダ設定セクションに7つのテキスト入力フィールドが表示される: Fleeting/Literature/Permanent/Structure/Indexノートフォルダ、テンプレートフォルダ、デイリーノートフォルダ", verification: "new Setting(containerEl).setName('Fleeting Notes').addText()で各フォルダパス入力欄が作成され、DEFAULT_SETTINGSの値がプレースホルダーまたは初期値として表示される" },
        { criterion: "各フォルダパステキストフィールドで値を変更しフォーカスアウト時、plugin.saveSettings()が呼ばれsettings.folders.typeFolders[type]またはsettings.folders.templateFolderに反映される", verification: "onChange((value) => { this.plugin.settings.folders.typeFolders.fleeting = value; await this.plugin.saveSettings(); })が実行され、プラグイン再読み込み後も変更が永続化される" },
        { criterion: "動作設定セクションに4つのトグルスイッチが表示される: insertLinkAfterExtract(切り出し後にリンク挿入)/suggestStructureOnPermanent(Permanent作成時にStructure提案)/moveOnPromotion(昇格時にフォルダ移動)/showEmojiInCommands(コマンドに絵文字表示)", verification: "new Setting(containerEl).setName('切り出し後にリンク挿入').addToggle()で各トグルが作成され、現在の設定値がON/OFF状態として表示される" },
        { criterion: "各トグルスイッチをタップ時、plugin.saveSettings()が呼ばれsettings.behavior[key]またはsettings.ui[key]のboolean値が反転する", verification: "onChange((value) => { this.plugin.settings.behavior.insertLinkAfterExtract = value; await this.plugin.saveSettings(); })が実行され、プラグイン再読み込み後もトグル状態が永続化される" },
        { criterion: "動作設定セクションにファイル名プレフィックス形式のドロップダウンが表示され、date(日付形式)/zettel-id(Zettelkasten ID)/none(プレフィックスなし)の3オプションが選択可能", verification: "new Setting(containerEl).setName('ファイル名プレフィックス').addDropdown((dropdown) => dropdown.addOption('date', '日付形式').addOption('zettel-id', 'Zettelkasten ID').addOption('none', 'なし'))が作成され、settings.behavior.fileNamePrefixの現在値が選択状態として表示される" },
        { criterion: "ドロップダウンで選択肢変更時、plugin.saveSettings()が呼ばれsettings.behavior.fileNamePrefixに'date'/'zettel-id'/'none'のいずれかが設定される", verification: "onChange((value) => { this.plugin.settings.behavior.fileNamePrefix = value as 'date' | 'zettel-id' | 'none'; await this.plugin.saveSettings(); })が実行され、プラグイン再読み込み後も選択が永続化される" },
      ],
      status: "ready",
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

  sprint: null,

  definition_of_done: {
    checks: [
      { name: "Build passes", run: "pnpm build" },
      { name: "Lint passes", run: "pnpm lint" },
      { name: "Format check passes", run: "pnpm format:check" },
    ],
  },

  completed: [
    { number: 1, pbi_id: "PBI-001", goal: "NoteType型定義と設定マップ実装", status: "done", subtasks: [{ test: "型定義+定数", implementation: "src/types/note-types.ts", type: "behavioral", status: "completed", commits: [{ hash: "1eb7e33", message: "feat: implement NoteType type system", phase: "green" }], notes: [] }] },
    { number: 2, pbi_id: "PBI-002", goal: "FrontmatterService実装", status: "done", subtasks: [{ test: "5メソッド", implementation: "src/services/frontmatter-service.ts", type: "behavioral", status: "completed", commits: [{ hash: "0268c21", message: "feat: implement FrontmatterService", phase: "green" }], notes: [] }] },
    { number: 3, pbi_id: "PBI-003", goal: "選択テキストからノート作成", status: "done", subtasks: [
      { test: "ExtractSelectionCommand+NoteManager", implementation: "src/commands/, src/core/", type: "behavioral", status: "completed", commits: [{ hash: "527d854", message: "feat: ExtractSelectionCommand", phase: "green" }], notes: [] },
      { test: "NoteTypeModal+StructureSuggestModal", implementation: "src/ui/modals/", type: "behavioral", status: "completed", commits: [{ hash: "fe1949d", message: "feat: Modals", phase: "green" }, { hash: "67af70b", message: "feat: StructureSuggestModal", phase: "green" }], notes: [] },
    ] },
    { number: 4, pbi_id: "PBI-004", goal: "テンプレートベースのノート作成機能実装", status: "done", subtasks: [
      { test: "TemplateService+テンプレートファイル", implementation: "src/services/template-service.ts, Templates/*.md", type: "behavioral", status: "completed", commits: [
        { hash: "275b08c", message: "feat(PBI-004): implement template-based note creation", phase: "green" },
        { hash: "7813d8b", message: "fix(PBI-004): correct TFile type guard in TemplateService.loadTemplate()", phase: "green" },
      ], notes: [
        "loadTemplate(): テンプレートファイル読み込み (TFile型ガード修正)",
        "expandVariables(): {{title}}, {{content}}, {{date:FORMAT}}展開",
        "5つのテンプレートファイル作成（各タイプ固有セクション）",
        "Sprint Review時に型エラー検出→修正",
      ] },
    ] },
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
        { action: "サブタスクをより小さく分割（1メソッド=1コミット粒度）", timing: "sprint", status: "completed", outcome: "Sprint 3で適用。18サブタスクに分割したが実際は3コミットに集約された" },
        { action: "受け入れ基準を振る舞い視点で記述", timing: "sprint", status: "completed", outcome: "Sprint 3で適用。実装が明確になり初回でDoD通過" },
      ],
    },
    {
      sprint: 3,
      improvements: [
        { action: "サブタスク粒度をコミット単位に調整（論理的に関連する実装をグループ化）", timing: "sprint", status: "completed", outcome: "Sprint 4で有効性確認。1サブタスク=1コミットが実現" },
        { action: "複数ファイルにまたがる機能は1サブタスクとして扱う", timing: "sprint", status: "completed", outcome: "Sprint 4で有効性確認。TemplateService+5テンプレートファイルを論理的に1単位として扱えた" },
      ],
    },
    {
      sprint: 4,
      improvements: [
        { action: "AC記載のファイル名と実装の整合性を事前確認（例: fleeting vs fleeting-template.md）", timing: "sprint", status: "active", outcome: null },
        { action: "サブタスクnotesを事前計画として活用（実装前に技術的なアプローチを記載）", timing: "sprint", status: "active", outcome: null },
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
