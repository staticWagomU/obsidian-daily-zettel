# obsidian-page-zettel 実装ドキュメント

## 目次

1. [プロジェクト概要](#1-プロジェクト概要)
2. [技術スタック](#2-技術スタック)
3. [ディレクトリ構造](#3-ディレクトリ構造)
4. [型定義](#4-型定義)
5. [コアモジュール設計](#5-コアモジュール設計)
6. [サービス層設計](#6-サービス層設計)
7. [UIコンポーネント設計](#7-uiコンポーネント設計)
8. [コマンド設計](#8-コマンド設計)
9. [設定スキーマ](#9-設定スキーマ)
10. [テンプレート定義](#10-テンプレート定義)
11. [Obsidian API リファレンス](#11-obsidian-api-リファレンス)
12. [実装手順](#12-実装手順)
13. [テスト計画](#13-テスト計画)

---

## 1. プロジェクト概要

### 1.1 目的

ページを起点とした Zettelkasten ワークフローを Obsidian で実現するプラグイン。
**モバイルメイン使用**を前提に、最小限の操作でノートの切り出し・分類・接続を自動化する。

### 1.2 解決する課題

| 課題 | 解決策 |
|------|--------|
| 5種類のノートタイプの判断負荷 | 選択肢を絞り、段階的昇格モデルを採用 |
| メタデータ付与の手間 | フロントマター・フォルダ配置を自動化 |
| ノート間接続の管理 | Structure Note への自動提案 + 孤立ノートの可視化 |
| モバイルでの操作性 | 大きなタップターゲット、コマンドパレット最適化 |

### 1.3 ノートタイプと遷移モデル

```
                    ┌─────────────┐
                    │  Literature │ （独立系統）
                    └─────────────┘

┌──────────┐    ┌───────────┐    ┌───────────┐    ┌─────────┐
│ Fleeting │ →  │ Permanent │ →  │ Structure │ →  │  Index  │
└──────────┘    └───────────┘    └───────────┘    └─────────┘
   一時メモ        原子的知識         MOC          トップ目次
```

---

## 2. 技術スタック

### 2.1 必須依存

```json
{
  "devDependencies": {
    "@types/node": "^16.11.6",
    "typescript": "^5.0.0",
    "esbuild": "^0.17.0",
    "obsidian": "latest"
  }
}
```

### 2.2 開発ツール

| ツール | 用途 |
|--------|------|
| TypeScript | 型安全な開発 |
| esbuild | 高速バンドル |
| ESLint | コード品質 |
| Prettier | コードフォーマット |

### 2.3 Obsidian API バージョン

```json
{
  "minAppVersion": "1.0.0"
}
```

---

## 3. ディレクトリ構造

```
obsidian-page-zettel/
├── src/
│   ├── main.ts                          # プラグインエントリーポイント
│   │
│   ├── types/
│   │   ├── index.ts                     # 型エクスポート
│   │   ├── note-types.ts                # ノートタイプ定義
│   │   └── settings.ts                  # 設定型定義
│   │
│   ├── core/
│   │   ├── NoteManager.ts               # ノート作成・昇格
│   │   ├── FrontmatterService.ts        # フロントマター操作
│   │   └── ConnectionManager.ts         # ノート間接続
│   │
│   ├── services/
│   │   ├── TemplateService.ts           # テンプレート処理
│   │   ├── FolderService.ts             # フォルダ配置
│   │   ├── SuggestionService.ts         # Structure 提案
│   │   └── OrphanDetector.ts            # 孤立検出
│   │
│   ├── ui/
│   │   ├── modals/
│   │   │   ├── NoteTypeModal.ts         # タイプ選択
│   │   │   ├── StructureSuggestModal.ts # Structure 提案
│   │   │   └── QuickCaptureModal.ts     # クイック入力
│   │   │
│   │   └── views/
│   │       └── OrphanView.ts            # 孤立ノートビュー
│   │
│   ├── commands/
│   │   ├── index.ts                     # コマンド登録
│   │   ├── ExtractSelectionCommand.ts   # 選択切り出し
│   │   ├── PromoteNoteCommand.ts        # ノート昇格
│   │   └── LinkToStructureCommand.ts    # Structure 接続
│   │
│   └── settings/
│       ├── SettingsTab.ts               # 設定UI
│       └── defaults.ts                  # デフォルト値
│
├── styles.css                           # カスタムスタイル
├── manifest.json                        # プラグインマニフェスト
├── versions.json                        # バージョン互換性
├── package.json
├── tsconfig.json
├── esbuild.config.mjs
└── .eslintrc.js
```

---

## 4. 型定義

### 4.1 `src/types/note-types.ts`

```typescript
/**
 * Zettelkasten ノートタイプ
 */
export type NoteType =
  | 'fleeting'
  | 'literature'
  | 'permanent'
  | 'structure'
  | 'index';

/**
 * ノートタイプごとの設定
 */
export interface NoteTypeConfig {
  /** 表示ラベル */
  label: string;
  /** 日本語ラベル */
  labelJa: string;
  /** 説明文 */
  description: string;
  /** アイコン（絵文字） */
  icon: string;
  /** 保存先フォルダ */
  folder: string;
  /** テンプレートファイル名 */
  template: string;
}

/**
 * 全ノートタイプの設定マップ
 */
export const NOTE_TYPE_CONFIG: Record<NoteType, NoteTypeConfig> = {
  fleeting: {
    label: 'Fleeting Note',
    labelJa: '一時メモ',
    description: 'Quick thought or idea to process later',
    icon: '💭',
    folder: '10-Fleeting',
    template: 'fleeting-template.md'
  },
  literature: {
    label: 'Literature Note',
    labelJa: '文献ノート',
    description: 'Notes from external sources (books, articles)',
    icon: '📚',
    folder: '20-Literature',
    template: 'literature-template.md'
  },
  permanent: {
    label: 'Permanent Note',
    labelJa: '永続ノート',
    description: 'Atomic, interconnected knowledge unit',
    icon: '💎',
    folder: '30-Permanent',
    template: 'permanent-template.md'
  },
  structure: {
    label: 'Structure Note',
    labelJa: '構造ノート',
    description: 'Map of Content (MOC) organizing notes',
    icon: '🗂️',
    folder: '40-Structure',
    template: 'structure-template.md'
  },
  index: {
    label: 'Index Note',
    labelJa: 'インデックス',
    description: 'Top-level entry point',
    icon: '📋',
    folder: '50-Index',
    template: 'index-template.md'
  }
};

/**
 * 昇格パス定義
 * キー: 元のタイプ, 値: 昇格可能なタイプの配列
 */
export const PROMOTION_PATHS: Record<NoteType, NoteType[]> = {
  fleeting: ['permanent'],
  literature: [],  // Literature は独立（昇格なし）
  permanent: ['structure'],
  structure: ['index'],
  index: []
};

/**
 * ノートのメタデータ（フロントマター）
 */
export interface NoteMetadata {
  type: NoteType;
  created: string;  // ISO 8601
  tags: string[];

  // オプショナル
  source_notes?: string[];      // 元ノートへのリンク
  structure_notes?: string[];   // 所属 Structure Note
  status?: NoteStatus;
  promoted_from?: NoteType;
  promoted_at?: string;

  // Literature 固有
  source_type?: 'book' | 'article' | 'video' | 'podcast' | 'other';
  source_title?: string;
  source_author?: string;
  source_url?: string;
}

/**
 * ノートの成熟度ステータス
 */
export type NoteStatus = 'draft' | 'reviewed' | 'mature';
```

### 4.2 `src/types/settings.ts`

```typescript
import { NoteType } from './note-types';

/**
 * プラグイン設定
 */
export interface PageZettelSettings {
  // フォルダ設定
  folders: FolderSettings;

  // テンプレート設定
  templates: TemplateSettings;

  // 動作設定
  behavior: BehaviorSettings;

  // UI設定
  ui: UISettings;
}

export interface FolderSettings {
  /** ノートタイプ別フォルダパス */
  typeFolders: Record<NoteType, string>;
  /** テンプレートフォルダ */
  templateFolder: string;
  /** デイリーノートフォルダ */
  dailyNoteFolder: string;
}

export interface TemplateSettings {
  /** テンプレート使用有無 */
  useTemplates: boolean;
  /** Templater 連携 */
  useTemplater: boolean;
}

export interface BehaviorSettings {
  /** 切り出し後に元ノートにリンクを挿入 */
  insertLinkAfterExtract: boolean;
  /** Permanent 作成時に Structure 提案を表示 */
  suggestStructureOnPermanent: boolean;
  /** 昇格時に自動でフォルダ移動 */
  moveOnPromotion: boolean;
  /** ファイル名のプレフィックス形式 */
  fileNamePrefix: 'date' | 'zettel-id' | 'none';
}

export interface UISettings {
  /** コマンドに絵文字を表示 */
  showEmojiInCommands: boolean;
  /** モバイル最適化UI */
  mobileOptimized: boolean;
}
```

---

## 5. コアモジュール設計

### 5.1 `src/core/NoteManager.ts`

```typescript
import { App, TFile, TFolder, Notice } from 'obsidian';
import {
  NoteType,
  NoteMetadata,
  NOTE_TYPE_CONFIG,
  PROMOTION_PATHS
} from '../types/note-types';
import { PageZettelSettings } from '../types/settings';
import { FrontmatterService } from './FrontmatterService';
import { TemplateService } from '../services/TemplateService';
import { FolderService } from '../services/FolderService';

export interface CreateNoteOptions {
  title: string;
  type: NoteType;
  content?: string;
  sourceFile?: TFile;
  additionalMetadata?: Partial<NoteMetadata>;
}

export interface PromoteNoteResult {
  success: boolean;
  newType?: NoteType;
  error?: string;
}

export class NoteManager {
  private app: App;
  private settings: PageZettelSettings;
  private frontmatterService: FrontmatterService;
  private templateService: TemplateService;
  private folderService: FolderService;

  constructor(app: App, settings: PageZettelSettings) {
    this.app = app;
    this.settings = settings;
    this.frontmatterService = new FrontmatterService(app);
    this.templateService = new TemplateService(app, settings);
    this.folderService = new FolderService(app, settings);
  }

  /**
   * 新規ノートを作成
   */
  async createNote(options: CreateNoteOptions): Promise<TFile> {
    const { title, type, content = '', sourceFile, additionalMetadata } = options;

    // 1. フォルダを確保
    const folderPath = await this.folderService.ensureFolderExists(type);

    // 2. ファイル名を生成
    const fileName = this.generateFileName(title);
    const filePath = `${folderPath}/${fileName}`;

    // 3. テンプレートを取得・処理
    const templateContent = await this.templateService.getProcessedTemplate(type, {
      title,
      content,
      date: new Date().toISOString(),
    });

    // 4. メタデータを構築
    const metadata: NoteMetadata = {
      type,
      created: new Date().toISOString(),
      tags: [type],
      ...additionalMetadata,
    };

    if (sourceFile) {
      metadata.source_notes = [`[[${sourceFile.basename}]]`];
    }

    // 5. フロントマター + コンテンツを結合
    const finalContent = this.frontmatterService.addFrontmatter(
      templateContent || content,
      metadata
    );

    // 6. ファイル作成
    const file = await this.app.vault.create(filePath, finalContent);

    new Notice(`✅ Created ${NOTE_TYPE_CONFIG[type].icon} ${title}`);

    return file;
  }

  /**
   * ノートを昇格
   */
  async promoteNote(file: TFile, targetType: NoteType): Promise<PromoteNoteResult> {
    // 1. 現在のタイプを取得
    const currentType = await this.frontmatterService.getNoteType(file);

    if (!currentType) {
      return { success: false, error: 'Cannot determine current note type' };
    }

    // 2. 昇格可能性をチェック
    if (!this.canPromote(currentType, targetType)) {
      return {
        success: false,
        error: `Cannot promote from ${currentType} to ${targetType}`
      };
    }

    // 3. フロントマターを更新
    await this.frontmatterService.updateMetadata(file, {
      type: targetType,
      promoted_from: currentType,
      promoted_at: new Date().toISOString(),
    });

    // 4. フォルダを移動（設定で有効な場合）
    if (this.settings.behavior.moveOnPromotion) {
      await this.moveToTypeFolder(file, targetType);
    }

    // 5. タグを更新
    await this.frontmatterService.updateTags(file, [currentType], [targetType]);

    new Notice(`⬆️ Promoted to ${NOTE_TYPE_CONFIG[targetType].icon} ${targetType}`);

    return { success: true, newType: targetType };
  }

  /**
   * 昇格可能かチェック
   */
  canPromote(from: NoteType, to: NoteType): boolean {
    return PROMOTION_PATHS[from]?.includes(to) ?? false;
  }

  /**
   * 昇格可能なタイプを取得
   */
  getPromotionTargets(from: NoteType): NoteType[] {
    return PROMOTION_PATHS[from] || [];
  }

  /**
   * ノートをタイプ別フォルダに移動
   */
  private async moveToTypeFolder(file: TFile, type: NoteType): Promise<void> {
    const targetFolder = await this.folderService.ensureFolderExists(type);
    const newPath = `${targetFolder}/${file.name}`;

    if (file.path !== newPath) {
      await this.app.fileManager.renameFile(file, newPath);
    }
  }

  /**
   * ファイル名を生成
   */
  private generateFileName(title: string): string {
    const sanitizedTitle = title.replace(/[\\/:*?"<>|]/g, '-').trim();

    switch (this.settings.behavior.fileNamePrefix) {
      case 'date':
        const datePrefix = new Date().toISOString().slice(0, 10);
        return `${datePrefix}-${sanitizedTitle}.md`;
      case 'zettel-id':
        const zettelId = new Date().toISOString()
          .replace(/[-:T]/g, '')
          .slice(0, 14);
        return `${zettelId}-${sanitizedTitle}.md`;
      case 'none':
      default:
        return `${sanitizedTitle}.md`;
    }
  }
}
```

### 5.2 `src/core/FrontmatterService.ts`

```typescript
import { App, TFile, parseYaml, stringifyYaml } from 'obsidian';
import { NoteType, NoteMetadata } from '../types/note-types';

export class FrontmatterService {
  private app: App;

  constructor(app: App) {
    this.app = app;
  }

  /**
   * ノートタイプを取得
   */
  async getNoteType(file: TFile): Promise<NoteType | null> {
    const cache = this.app.metadataCache.getFileCache(file);
    return (cache?.frontmatter?.type as NoteType) || null;
  }

  /**
   * フロントマターからメタデータを取得
   */
  async getMetadata(file: TFile): Promise<Partial<NoteMetadata>> {
    const cache = this.app.metadataCache.getFileCache(file);
    return cache?.frontmatter || {};
  }

  /**
   * コンテンツにフロントマターを追加
   */
  addFrontmatter(content: string, metadata: NoteMetadata): string {
    const yaml = stringifyYaml(metadata);
    return `---\n${yaml}---\n\n${content}`;
  }

  /**
   * フロントマターのメタデータを更新
   */
  async updateMetadata(
    file: TFile,
    updates: Partial<NoteMetadata>
  ): Promise<void> {
    await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
      Object.assign(frontmatter, updates);
    });
  }

  /**
   * タグを更新（削除と追加）
   */
  async updateTags(
    file: TFile,
    tagsToRemove: string[],
    tagsToAdd: string[]
  ): Promise<void> {
    await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
      const currentTags: string[] = frontmatter.tags || [];

      // 削除
      const filtered = currentTags.filter(t => !tagsToRemove.includes(t));

      // 追加（重複なし）
      const newTags = [...new Set([...filtered, ...tagsToAdd])];

      frontmatter.tags = newTags;
    });
  }

  /**
   * Structure Note へのリンクを追加
   */
  async addStructureLink(
    file: TFile,
    structureNote: TFile
  ): Promise<void> {
    await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
      const links: string[] = frontmatter.structure_notes || [];
      const newLink = `[[${structureNote.basename}]]`;

      if (!links.includes(newLink)) {
        links.push(newLink);
        frontmatter.structure_notes = links;
      }
    });
  }
}
```

### 5.3 `src/core/ConnectionManager.ts`

```typescript
import { App, TFile } from 'obsidian';
import { FrontmatterService } from './FrontmatterService';

export class ConnectionManager {
  private app: App;
  private frontmatterService: FrontmatterService;

  constructor(app: App) {
    this.app = app;
    this.frontmatterService = new FrontmatterService(app);
  }

  /**
   * Permanent Note を Structure Note に接続
   */
  async linkPermanentToStructure(
    permanentNote: TFile,
    structureNote: TFile
  ): Promise<void> {
    // 1. Permanent Note のフロントマターを更新
    await this.frontmatterService.addStructureLink(permanentNote, structureNote);

    // 2. Structure Note にリンクを追加
    await this.appendLinkToStructure(structureNote, permanentNote);
  }

  /**
   * Structure Note の本文にリンクを追加
   */
  private async appendLinkToStructure(
    structureNote: TFile,
    targetNote: TFile
  ): Promise<void> {
    const content = await this.app.vault.read(structureNote);
    const link = `- [[${targetNote.basename}]]`;

    // 既にリンクが存在するかチェック
    if (content.includes(`[[${targetNote.basename}]]`)) {
      return;
    }

    // "## 関連ノート" セクションを探して追加
    const sectionRegex = /^## (関連ノート|Related Notes|Notes)/m;
    const match = content.match(sectionRegex);

    let newContent: string;
    if (match && match.index !== undefined) {
      // セクションの次の行に追加
      const insertPos = content.indexOf('\n', match.index) + 1;
      newContent =
        content.slice(0, insertPos) +
        link + '\n' +
        content.slice(insertPos);
    } else {
      // セクションがなければ末尾に追加
      newContent = content + `\n\n## 関連ノート\n\n${link}\n`;
    }

    await this.app.vault.modify(structureNote, newContent);
  }

  /**
   * ノートの接続状況を取得
   */
  async getConnections(file: TFile): Promise<{
    incoming: TFile[];
    outgoing: TFile[];
    structureNotes: TFile[];
  }> {
    const cache = this.app.metadataCache.getFileCache(file);
    const result = {
      incoming: [] as TFile[],
      outgoing: [] as TFile[],
      structureNotes: [] as TFile[],
    };

    // 発信リンク
    if (cache?.links) {
      for (const link of cache.links) {
        const linkedFile = this.app.metadataCache.getFirstLinkpathDest(
          link.link,
          file.path
        );
        if (linkedFile) {
          result.outgoing.push(linkedFile);
        }
      }
    }

    // 着信リンク（backlinks）
    // @ts-ignore - Obsidian の内部 API
    const backlinks = this.app.metadataCache.getBacklinksForFile(file);
    if (backlinks?.data) {
      for (const [path] of backlinks.data) {
        const linkedFile = this.app.vault.getAbstractFileByPath(path);
        if (linkedFile instanceof TFile) {
          result.incoming.push(linkedFile);
        }
      }
    }

    // Structure Notes
    const structureLinks = cache?.frontmatter?.structure_notes || [];
    for (const linkStr of structureLinks) {
      const basename = linkStr.replace(/^\[\[|\]\]$/g, '');
      const linkedFile = this.app.metadataCache.getFirstLinkpathDest(
        basename,
        file.path
      );
      if (linkedFile) {
        result.structureNotes.push(linkedFile);
      }
    }

    return result;
  }
}
```

---

## 6. サービス層設計

### 6.1 `src/services/TemplateService.ts`

```typescript
import { App, TFile } from 'obsidian';
import { NoteType, NOTE_TYPE_CONFIG } from '../types/note-types';
import { PageZettelSettings } from '../types/settings';

export interface TemplateVariables {
  title: string;
  content?: string;
  date: string;
  [key: string]: string | undefined;
}

export class TemplateService {
  private app: App;
  private settings: PageZettelSettings;

  constructor(app: App, settings: PageZettelSettings) {
    this.app = app;
    this.settings = settings;
  }

  /**
   * テンプレートを取得して変数を展開
   */
  async getProcessedTemplate(
    type: NoteType,
    variables: TemplateVariables
  ): Promise<string> {
    if (!this.settings.templates.useTemplates) {
      return variables.content || '';
    }

    const templateContent = await this.loadTemplate(type);

    if (!templateContent) {
      return variables.content || '';
    }

    return this.processVariables(templateContent, variables);
  }

  /**
   * テンプレートファイルを読み込み
   */
  private async loadTemplate(type: NoteType): Promise<string | null> {
    const templateFileName = NOTE_TYPE_CONFIG[type].template;
    const templatePath = `${this.settings.folders.templateFolder}/${templateFileName}`;

    const file = this.app.vault.getAbstractFileByPath(templatePath);

    if (!(file instanceof TFile)) {
      return null;
    }

    return await this.app.vault.read(file);
  }

  /**
   * テンプレート変数を展開
   */
  private processVariables(
    template: string,
    variables: TemplateVariables
  ): string {
    let result = template;

    // {{variable}} 形式の置換
    for (const [key, value] of Object.entries(variables)) {
      if (value !== undefined) {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        result = result.replace(regex, value);
      }
    }

    // 日付フォーマット {{date:FORMAT}}
    result = result.replace(
      /\{\{date:([^}]+)\}\}/g,
      (_, format) => this.formatDate(new Date(), format)
    );

    return result;
  }

  /**
   * 日付をフォーマット
   */
  private formatDate(date: Date, format: string): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    return format
      .replace('YYYY', date.getFullYear().toString())
      .replace('MM', pad(date.getMonth() + 1))
      .replace('DD', pad(date.getDate()))
      .replace('HH', pad(date.getHours()))
      .replace('mm', pad(date.getMinutes()))
      .replace('ss', pad(date.getSeconds()));
  }
}
```

### 6.2 `src/services/FolderService.ts`

```typescript
import { App, TFolder } from 'obsidian';
import { NoteType, NOTE_TYPE_CONFIG } from '../types/note-types';
import { PageZettelSettings } from '../types/settings';

export class FolderService {
  private app: App;
  private settings: PageZettelSettings;

  constructor(app: App, settings: PageZettelSettings) {
    this.app = app;
    this.settings = settings;
  }

  /**
   * ノートタイプに対応するフォルダパスを取得
   */
  getFolderPath(type: NoteType): string {
    return this.settings.folders.typeFolders[type] ||
           NOTE_TYPE_CONFIG[type].folder;
  }

  /**
   * フォルダが存在することを確認し、なければ作成
   */
  async ensureFolderExists(type: NoteType): Promise<string> {
    const folderPath = this.getFolderPath(type);

    const existing = this.app.vault.getAbstractFileByPath(folderPath);

    if (!existing) {
      await this.app.vault.createFolder(folderPath);
    }

    return folderPath;
  }

  /**
   * 全てのタイプフォルダを初期化
   */
  async initializeAllFolders(): Promise<void> {
    const types: NoteType[] = [
      'fleeting', 'literature', 'permanent', 'structure', 'index'
    ];

    for (const type of types) {
      await this.ensureFolderExists(type);
    }

    // テンプレートフォルダも作成
    const templateFolder = this.settings.folders.templateFolder;
    const existing = this.app.vault.getAbstractFileByPath(templateFolder);
    if (!existing) {
      await this.app.vault.createFolder(templateFolder);
    }
  }
}
```

### 6.3 `src/services/SuggestionService.ts`

```typescript
import { App, TFile, CachedMetadata } from 'obsidian';
import { PageZettelSettings } from '../types/settings';

export interface SuggestionScore {
  file: TFile;
  score: number;
  reasons: string[];
}

export class SuggestionService {
  private app: App;
  private settings: PageZettelSettings;

  constructor(app: App, settings: PageZettelSettings) {
    this.app = app;
    this.settings = settings;
  }

  /**
   * Permanent Note に関連する Structure Notes を提案
   */
  async suggestStructureNotes(
    permanentNote: TFile,
    limit: number = 5
  ): Promise<TFile[]> {
    const structureNotes = this.getAllStructureNotes();
    const permanentMeta = this.app.metadataCache.getFileCache(permanentNote);
    const permanentTags = this.extractTags(permanentMeta);
    const permanentTitle = permanentNote.basename.toLowerCase();

    const scored: SuggestionScore[] = [];

    for (const structureNote of structureNotes) {
      const score = this.calculateScore(
        structureNote,
        permanentTags,
        permanentTitle
      );

      if (score.score > 0) {
        scored.push(score);
      }
    }

    // スコア降順でソート
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, limit).map(s => s.file);
  }

  /**
   * 全ての Structure Notes を取得
   */
  private getAllStructureNotes(): TFile[] {
    const structureFolder = this.settings.folders.typeFolders.structure;

    return this.app.vault.getMarkdownFiles().filter(file => {
      // フォルダベースのフィルタ
      if (file.path.startsWith(structureFolder)) {
        return true;
      }

      // フロントマターベースのフィルタ
      const cache = this.app.metadataCache.getFileCache(file);
      return cache?.frontmatter?.type === 'structure';
    });
  }

  /**
   * スコアを計算
   */
  private calculateScore(
    structureNote: TFile,
    targetTags: string[],
    targetTitle: string
  ): SuggestionScore {
    let score = 0;
    const reasons: string[] = [];

    const structureMeta = this.app.metadataCache.getFileCache(structureNote);
    const structureTags = this.extractTags(structureMeta);
    const structureTitle = structureNote.basename.toLowerCase();

    // タグの一致（各10点）
    for (const tag of targetTags) {
      if (structureTags.includes(tag)) {
        score += 10;
        reasons.push(`Tag match: ${tag}`);
      }
    }

    // タイトルの単語マッチ（各5点）
    const targetWords = targetTitle.split(/[\s-_]+/).filter(w => w.length > 2);
    const structureWords = structureTitle.split(/[\s-_]+/).filter(w => w.length > 2);

    for (const word of targetWords) {
      if (structureWords.some(sw => sw.includes(word) || word.includes(sw))) {
        score += 5;
        reasons.push(`Title word match: ${word}`);
      }
    }

    // 既存のリンク関係（20点）
    if (structureMeta?.links) {
      const hasLink = structureMeta.links.some(
        link => link.link.toLowerCase() === targetTitle
      );
      if (hasLink) {
        score += 20;
        reasons.push('Already linked');
      }
    }

    return { file: structureNote, score, reasons };
  }

  /**
   * メタデータからタグを抽出
   */
  private extractTags(meta: CachedMetadata | null): string[] {
    if (!meta) return [];

    const frontmatterTags = meta.frontmatter?.tags || [];
    const inlineTags = meta.tags?.map(t => t.tag.replace('#', '')) || [];

    return [...new Set([...frontmatterTags, ...inlineTags])];
  }
}
```

### 6.4 `src/services/OrphanDetector.ts`

```typescript
import { App, TFile } from 'obsidian';
import { PageZettelSettings } from '../types/settings';

export interface OrphanStats {
  total: number;
  orphans: TFile[];
  connected: TFile[];
}

export class OrphanDetector {
  private app: App;
  private settings: PageZettelSettings;

  constructor(app: App, settings: PageZettelSettings) {
    this.app = app;
    this.settings = settings;
  }

  /**
   * 孤立した Permanent Notes を検出
   * 孤立 = structure_notes が空または未定義
   */
  async detectOrphanPermanentNotes(): Promise<TFile[]> {
    const permanentFolder = this.settings.folders.typeFolders.permanent;
    const permanentNotes = this.app.vault.getMarkdownFiles().filter(file => {
      // フォルダベースまたはフロントマターベース
      if (file.path.startsWith(permanentFolder)) {
        return true;
      }
      const cache = this.app.metadataCache.getFileCache(file);
      return cache?.frontmatter?.type === 'permanent';
    });

    const orphans: TFile[] = [];

    for (const file of permanentNotes) {
      const isOrphan = await this.isOrphan(file);
      if (isOrphan) {
        orphans.push(file);
      }
    }

    // 作成日時の新しい順にソート
    orphans.sort((a, b) => b.stat.ctime - a.stat.ctime);

    return orphans;
  }

  /**
   * ノートが孤立しているかチェック
   */
  private async isOrphan(file: TFile): Promise<boolean> {
    const cache = this.app.metadataCache.getFileCache(file);
    const structureNotes = cache?.frontmatter?.structure_notes;

    // structure_notes が存在しない or 空配列 or 空文字列
    if (!structureNotes) return true;
    if (Array.isArray(structureNotes) && structureNotes.length === 0) return true;
    if (typeof structureNotes === 'string' && structureNotes.trim() === '') return true;

    return false;
  }

  /**
   * 統計情報を取得
   */
  async getStats(): Promise<OrphanStats> {
    const orphans = await this.detectOrphanPermanentNotes();
    const permanentFolder = this.settings.folders.typeFolders.permanent;

    const allPermanent = this.app.vault.getMarkdownFiles().filter(file => {
      if (file.path.startsWith(permanentFolder)) return true;
      const cache = this.app.metadataCache.getFileCache(file);
      return cache?.frontmatter?.type === 'permanent';
    });

    const connected = allPermanent.filter(f => !orphans.includes(f));

    return {
      total: allPermanent.length,
      orphans,
      connected,
    };
  }
}
```

---

## 7. UIコンポーネント設計

### 7.1 `src/ui/modals/NoteTypeModal.ts`

```typescript
import { App, FuzzySuggestModal } from 'obsidian';
import { NoteType, NOTE_TYPE_CONFIG, NoteTypeConfig } from '../../types/note-types';

interface NoteTypeOption {
  type: NoteType;
  config: NoteTypeConfig;
}

export class NoteTypeModal extends FuzzySuggestModal<NoteTypeOption> {
  private onSelect: (type: NoteType) => void;
  private allowedTypes: NoteType[];

  constructor(
    app: App,
    onSelect: (type: NoteType) => void,
    allowedTypes?: NoteType[]
  ) {
    super(app);
    this.onSelect = onSelect;
    this.allowedTypes = allowedTypes ?? ['fleeting', 'literature', 'permanent'];

    this.setPlaceholder('ノートタイプを選択...');

    // モバイル対応: モーダルのサイズ調整
    this.modalEl.addClass('page-zettel-modal');
  }

  getItems(): NoteTypeOption[] {
    return this.allowedTypes.map(type => ({
      type,
      config: NOTE_TYPE_CONFIG[type],
    }));
  }

  getItemText(item: NoteTypeOption): string {
    return `${item.config.icon} ${item.config.label}`;
  }

  renderSuggestion(item: { item: NoteTypeOption }, el: HTMLElement): void {
    const option = item.item;

    el.addClass('page-zettel-type-option');

    const container = el.createDiv({ cls: 'page-zettel-type-container' });

    // アイコン
    container.createSpan({
      text: option.config.icon,
      cls: 'page-zettel-type-icon'
    });

    // テキスト部分
    const textContainer = container.createDiv({ cls: 'page-zettel-type-text' });

    // ラベル
    textContainer.createDiv({
      text: option.config.label,
      cls: 'page-zettel-type-label'
    });

    // 説明
    textContainer.createDiv({
      text: option.config.description,
      cls: 'page-zettel-type-description'
    });
  }

  onChooseItem(item: NoteTypeOption): void {
    this.onSelect(item.type);
  }
}
```

### 7.2 `src/ui/modals/StructureSuggestModal.ts`

```typescript
import { App, FuzzySuggestModal, TFile, Notice } from 'obsidian';
import { SuggestionService } from '../../services/SuggestionService';
import { PageZettelSettings } from '../../types/settings';

interface StructureOption {
  file: TFile | null;
  label: string;
  isSkip: boolean;
}

export class StructureSuggestModal extends FuzzySuggestModal<StructureOption> {
  private permanentNote: TFile;
  private onSelect: (file: TFile | null) => void;
  private suggestionService: SuggestionService;
  private suggestions: TFile[] = [];

  constructor(
    app: App,
    settings: PageZettelSettings,
    permanentNote: TFile,
    onSelect: (file: TFile | null) => void
  ) {
    super(app);
    this.permanentNote = permanentNote;
    this.onSelect = onSelect;
    this.suggestionService = new SuggestionService(app, settings);

    this.setPlaceholder('Structure Note を選択（またはスキップ）...');
    this.modalEl.addClass('page-zettel-modal');

    // 提案を非同期で読み込み
    this.loadSuggestions();
  }

  private async loadSuggestions(): Promise<void> {
    this.suggestions = await this.suggestionService.suggestStructureNotes(
      this.permanentNote,
      10
    );
    // 再描画をトリガー
    this.inputEl.dispatchEvent(new Event('input'));
  }

  getItems(): StructureOption[] {
    const options: StructureOption[] = [];

    // スキップオプションを最初に
    options.push({
      file: null,
      label: '⏭️ スキップ（後で接続）',
      isSkip: true,
    });

    // 提案された Structure Notes
    for (const file of this.suggestions) {
      options.push({
        file,
        label: file.basename,
        isSkip: false,
      });
    }

    return options;
  }

  getItemText(item: StructureOption): string {
    return item.label;
  }

  renderSuggestion(item: { item: StructureOption }, el: HTMLElement): void {
    const option = item.item;

    el.addClass('page-zettel-structure-option');

    if (option.isSkip) {
      el.addClass('page-zettel-skip-option');
      el.createSpan({ text: option.label });
    } else {
      el.createSpan({ text: '🗂️ ', cls: 'page-zettel-structure-icon' });
      el.createSpan({ text: option.label });
    }
  }

  onChooseItem(item: StructureOption): void {
    if (item.isSkip) {
      new Notice('📝 後で Structure Note に接続できます');
      this.onSelect(null);
    } else {
      this.onSelect(item.file);
    }
  }
}
```

### 7.3 `src/ui/views/OrphanView.ts`

```typescript
import { ItemView, WorkspaceLeaf, TFile } from 'obsidian';
import PageZettelPlugin from '../../main';
import { OrphanDetector } from '../../services/OrphanDetector';

export const VIEW_TYPE_ORPHAN = 'page-zettel-orphan-view';

export class OrphanView extends ItemView {
  private plugin: PageZettelPlugin;
  private orphanDetector: OrphanDetector;

  constructor(leaf: WorkspaceLeaf, plugin: PageZettelPlugin) {
    super(leaf);
    this.plugin = plugin;
    this.orphanDetector = new OrphanDetector(
      plugin.app,
      plugin.settings
    );
  }

  getViewType(): string {
    return VIEW_TYPE_ORPHAN;
  }

  getDisplayText(): string {
    return '孤立 Permanent Notes';
  }

  getIcon(): string {
    return 'unlink';
  }

  async onOpen(): Promise<void> {
    await this.render();
  }

  async render(): Promise<void> {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass('page-zettel-orphan-view');

    // ヘッダー
    const header = container.createDiv({ cls: 'page-zettel-orphan-header' });
    header.createEl('h4', { text: '🔗 孤立 Permanent Notes' });

    // 統計
    const stats = await this.orphanDetector.getStats();
    const statsEl = header.createDiv({ cls: 'page-zettel-orphan-stats' });
    statsEl.createSpan({
      text: `${stats.orphans.length} / ${stats.total} 件が未接続`
    });

    // リフレッシュボタン
    const refreshBtn = header.createEl('button', {
      text: '🔄',
      cls: 'page-zettel-refresh-btn',
      attr: { 'aria-label': '更新' }
    });
    refreshBtn.addEventListener('click', () => this.render());

    // リスト
    if (stats.orphans.length === 0) {
      container.createDiv({
        text: '✅ すべての Permanent Notes は Structure Note に接続されています！',
        cls: 'page-zettel-orphan-empty'
      });
      return;
    }

    const list = container.createEl('ul', { cls: 'page-zettel-orphan-list' });

    for (const file of stats.orphans) {
      this.renderOrphanItem(list, file);
    }
  }

  private renderOrphanItem(list: HTMLUListElement, file: TFile): void {
    const item = list.createEl('li', { cls: 'page-zettel-orphan-item' });

    // ファイルリンク
    const link = item.createEl('a', {
      text: file.basename,
      cls: 'page-zettel-orphan-link'
    });
    link.addEventListener('click', (e) => {
      e.preventDefault();
      this.app.workspace.openLinkText(file.path, '');
    });

    // アクションボタン
    const actions = item.createDiv({ cls: 'page-zettel-orphan-actions' });

    const linkBtn = actions.createEl('button', {
      text: '🔗 接続',
      cls: 'page-zettel-action-btn'
    });
    linkBtn.addEventListener('click', async () => {
      await this.plugin.linkToStructure(file);
      await this.render();
    });
  }
}
```

---

## 8. コマンド設計

### 8.1 `src/commands/index.ts`

```typescript
import { Plugin, Editor, MarkdownView } from 'obsidian';
import { PageZettelSettings } from '../types/settings';
import { extractSelection } from './ExtractSelectionCommand';
import { promoteNote } from './PromoteNoteCommand';
import { linkToStructure } from './LinkToStructureCommand';

export function registerCommands(
  plugin: Plugin,
  settings: PageZettelSettings
): void {
  const emoji = settings.ui.showEmojiInCommands;

  // 選択範囲から新規ノート作成
  plugin.addCommand({
    id: 'extract-selection',
    name: emoji ? '📝 選択範囲から新規ノート' : '選択範囲から新規ノート',
    editorCallback: (editor: Editor, view: MarkdownView) => {
      extractSelection(plugin, editor, view);
    },
    hotkeys: [{ modifiers: ['Mod', 'Shift'], key: 'e' }]
  });

  // ノート昇格
  plugin.addCommand({
    id: 'promote-note',
    name: emoji ? '⬆️ ノートを昇格' : 'ノートを昇格',
    callback: () => promoteNote(plugin),
    hotkeys: [{ modifiers: ['Mod', 'Shift'], key: 'p' }]
  });

  // Structure Note に接続
  plugin.addCommand({
    id: 'link-to-structure',
    name: emoji ? '🔗 Structure Note に接続' : 'Structure Note に接続',
    callback: () => linkToStructure(plugin)
  });

  // クイック Fleeting ノート
  plugin.addCommand({
    id: 'quick-fleeting',
    name: emoji ? '💭 クイック Fleeting ノート' : 'クイック Fleeting ノート',
    callback: () => {
      // QuickCaptureModal を開く
      // plugin.openQuickCapture('fleeting');
    },
    hotkeys: [{ modifiers: ['Mod'], key: 'n' }]
  });

  // 孤立ノート表示
  plugin.addCommand({
    id: 'show-orphans',
    name: emoji ? '👁️ 孤立ノートを表示' : '孤立ノートを表示',
    callback: () => {
      // OrphanView を開く
      // plugin.showOrphanView();
    }
  });
}
```

### 8.2 `src/commands/ExtractSelectionCommand.ts`

```typescript
import { Editor, MarkdownView, Notice, Plugin } from 'obsidian';
import PageZettelPlugin from '../main';
import { NoteType } from '../types/note-types';
import { NoteTypeModal } from '../ui/modals/NoteTypeModal';
import { StructureSuggestModal } from '../ui/modals/StructureSuggestModal';

export async function extractSelection(
  plugin: PageZettelPlugin,
  editor: Editor,
  view: MarkdownView
): Promise<void> {
  // 1. 選択テキストを取得
  const selection = editor.getSelection();

  if (!selection || selection.trim() === '') {
    new Notice('⚠️ テキストを選択してください');
    return;
  }

  // 2. ノートタイプを選択
  const modal = new NoteTypeModal(
    plugin.app,
    async (type: NoteType) => {
      await createNoteFromSelection(plugin, editor, selection, type);
    },
    ['fleeting', 'literature', 'permanent']  // 切り出し時の選択肢
  );

  modal.open();
}

async function createNoteFromSelection(
  plugin: PageZettelPlugin,
  editor: Editor,
  selection: string,
  type: NoteType
): Promise<void> {
  // 3. タイトルを生成（最初の行 or 最初の20文字）
  const firstLine = selection.split('\n')[0].trim();
  const title = firstLine.length > 40
    ? firstLine.slice(0, 40) + '...'
    : firstLine;

  // 4. ノートを作成
  const sourceFile = plugin.app.workspace.getActiveFile();

  const newFile = await plugin.noteManager.createNote({
    title,
    type,
    content: selection,
    sourceFile: sourceFile ?? undefined,
  });

  // 5. 元ノートにリンクを挿入（設定で有効な場合）
  if (plugin.settings.behavior.insertLinkAfterExtract) {
    const link = `[[${newFile.basename}]]`;
    editor.replaceSelection(link);
  }

  // 6. Permanent の場合は Structure Note への接続を提案
  if (type === 'permanent' && plugin.settings.behavior.suggestStructureOnPermanent) {
    const structureModal = new StructureSuggestModal(
      plugin.app,
      plugin.settings,
      newFile,
      async (structureFile) => {
        if (structureFile) {
          await plugin.connectionManager.linkPermanentToStructure(
            newFile,
            structureFile
          );
        }
      }
    );
    structureModal.open();
  }

  // 7. 新規ノートを開く
  await plugin.app.workspace.openLinkText(newFile.path, '');
}
```

### 8.3 `src/commands/PromoteNoteCommand.ts`

```typescript
import { Notice, TFile } from 'obsidian';
import PageZettelPlugin from '../main';
import { NoteType, PROMOTION_PATHS } from '../types/note-types';
import { NoteTypeModal } from '../ui/modals/NoteTypeModal';
import { StructureSuggestModal } from '../ui/modals/StructureSuggestModal';

export async function promoteNote(plugin: PageZettelPlugin): Promise<void> {
  // 1. アクティブファイルを取得
  const file = plugin.app.workspace.getActiveFile();

  if (!file) {
    new Notice('⚠️ ノートを開いてください');
    return;
  }

  // 2. 現在のタイプを取得
  const currentType = await plugin.frontmatterService.getNoteType(file);

  if (!currentType) {
    new Notice('⚠️ このノートにはタイプが設定されていません');
    return;
  }

  // 3. 昇格可能なタイプを取得
  const targets = plugin.noteManager.getPromotionTargets(currentType);

  if (targets.length === 0) {
    new Notice(`ℹ️ ${currentType} はこれ以上昇格できません`);
    return;
  }

  // 4. 昇格先を選択（複数ある場合）
  if (targets.length === 1) {
    await executePromotion(plugin, file, targets[0]);
  } else {
    const modal = new NoteTypeModal(
      plugin.app,
      (targetType) => executePromotion(plugin, file, targetType),
      targets
    );
    modal.open();
  }
}

async function executePromotion(
  plugin: PageZettelPlugin,
  file: TFile,
  targetType: NoteType
): Promise<void> {
  const result = await plugin.noteManager.promoteNote(file, targetType);

  if (!result.success) {
    new Notice(`❌ 昇格失敗: ${result.error}`);
    return;
  }

  // Permanent への昇格時は Structure 接続を提案
  if (targetType === 'permanent' && plugin.settings.behavior.suggestStructureOnPermanent) {
    const structureModal = new StructureSuggestModal(
      plugin.app,
      plugin.settings,
      file,
      async (structureFile) => {
        if (structureFile) {
          await plugin.connectionManager.linkPermanentToStructure(file, structureFile);
        }
      }
    );
    structureModal.open();
  }
}
```

---

## 9. 設定スキーマ

### 9.1 `src/settings/defaults.ts`

```typescript
import { PageZettelSettings } from '../types/settings';
import { NOTE_TYPE_CONFIG, NoteType } from '../types/note-types';

/**
 * デフォルト設定値
 */
export const DEFAULT_SETTINGS: PageZettelSettings = {
  folders: {
    typeFolders: {
      fleeting: NOTE_TYPE_CONFIG.fleeting.folder,
      literature: NOTE_TYPE_CONFIG.literature.folder,
      permanent: NOTE_TYPE_CONFIG.permanent.folder,
      structure: NOTE_TYPE_CONFIG.structure.folder,
      index: NOTE_TYPE_CONFIG.index.folder,
    },
    templateFolder: 'Templates',
    dailyNoteFolder: '00-Inbox/Daily',
  },
  templates: {
    useTemplates: true,
    useTemplater: false,
  },
  behavior: {
    insertLinkAfterExtract: true,
    suggestStructureOnPermanent: true,
    moveOnPromotion: true,
    fileNamePrefix: 'date',
  },
  ui: {
    showEmojiInCommands: true,
    mobileOptimized: true,
  },
};
```

### 9.2 `src/settings/SettingsTab.ts`

```typescript
import { App, PluginSettingTab, Setting } from 'obsidian';
import PageZettelPlugin from '../main';
import { NoteType, NOTE_TYPE_CONFIG } from '../types/note-types';

export class PageZettelSettingsTab extends PluginSettingTab {
  plugin: PageZettelPlugin;

  constructor(app: App, plugin: PageZettelPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Page Zettel 設定' });

    // =====================================
    // フォルダ設定
    // =====================================
    containerEl.createEl('h3', { text: '📁 フォルダ設定' });

    const noteTypes: NoteType[] = [
      'fleeting', 'literature', 'permanent', 'structure', 'index'
    ];

    for (const type of noteTypes) {
      const config = NOTE_TYPE_CONFIG[type];
      new Setting(containerEl)
        .setName(`${config.icon} ${config.label} フォルダ`)
        .setDesc(`${config.labelJa}の保存先フォルダ`)
        .addText(text => text
          .setPlaceholder(config.folder)
          .setValue(this.plugin.settings.folders.typeFolders[type])
          .onChange(async (value) => {
            this.plugin.settings.folders.typeFolders[type] = value || config.folder;
            await this.plugin.saveSettings();
          })
        );
    }

    new Setting(containerEl)
      .setName('📄 テンプレートフォルダ')
      .setDesc('テンプレートファイルの保存先')
      .addText(text => text
        .setPlaceholder('Templates')
        .setValue(this.plugin.settings.folders.templateFolder)
        .onChange(async (value) => {
          this.plugin.settings.folders.templateFolder = value || 'Templates';
          await this.plugin.saveSettings();
        })
      );

    // =====================================
    // 動作設定
    // =====================================
    containerEl.createEl('h3', { text: '⚙️ 動作設定' });

    new Setting(containerEl)
      .setName('切り出し後にリンクを挿入')
      .setDesc('選択範囲を新規ノートに切り出した後、元の位置にリンクを挿入')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.behavior.insertLinkAfterExtract)
        .onChange(async (value) => {
          this.plugin.settings.behavior.insertLinkAfterExtract = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName('Permanent 作成時に Structure を提案')
      .setDesc('Permanent Note 作成時に関連する Structure Note を提案')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.behavior.suggestStructureOnPermanent)
        .onChange(async (value) => {
          this.plugin.settings.behavior.suggestStructureOnPermanent = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName('昇格時にフォルダ移動')
      .setDesc('ノート昇格時に対応するフォルダへ自動移動')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.behavior.moveOnPromotion)
        .onChange(async (value) => {
          this.plugin.settings.behavior.moveOnPromotion = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName('ファイル名プレフィックス')
      .setDesc('新規ノートのファイル名に付けるプレフィックス')
      .addDropdown(dropdown => dropdown
        .addOption('date', '日付 (YYYY-MM-DD)')
        .addOption('zettel-id', 'Zettel ID (YYYYMMDDHHmmss)')
        .addOption('none', 'なし')
        .setValue(this.plugin.settings.behavior.fileNamePrefix)
        .onChange(async (value: 'date' | 'zettel-id' | 'none') => {
          this.plugin.settings.behavior.fileNamePrefix = value;
          await this.plugin.saveSettings();
        })
      );

    // =====================================
    // UI設定
    // =====================================
    containerEl.createEl('h3', { text: '🎨 UI設定' });

    new Setting(containerEl)
      .setName('コマンドに絵文字を表示')
      .setDesc('コマンドパレットのコマンド名に絵文字を表示')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.ui.showEmojiInCommands)
        .onChange(async (value) => {
          this.plugin.settings.ui.showEmojiInCommands = value;
          await this.plugin.saveSettings();
        })
      );
  }
}
```

---

## 10. テンプレート定義

### 10.1 `Templates/fleeting-template.md`

```markdown
# {{title}}

## 💭 思考・アイデア

{{content}}

## 🔗 関連するかもしれないこと

-

## ✅ 次のアクション

- [ ] Permanent Note に昇格する
```

### 10.2 `Templates/literature-template.md`

```markdown
# {{title}}

## 📚 出典情報

- **タイトル**:
- **著者**:
- **URL/ISBN**:
- **読んだ日**: {{date:YYYY-MM-DD}}

## 📝 要約


## 💡 主要なポイント

1.

## 📌 引用・メモ

>

## 🤔 自分の考え


## 🔗 関連する Permanent Notes

-
```

### 10.3 `Templates/permanent-template.md`

```markdown
# {{title}}

## 💎 主張（1文で）


## 📖 説明

{{content}}

## 🧪 根拠・例


## 🔗 関連ノート

-

## 📚 参考文献

-
```

### 10.4 `Templates/structure-template.md`

```markdown
# {{title}}

## 🗂️ 概要


## 📑 主要な概念

### サブトピック 1

- [[]]

### サブトピック 2

- [[]]

## 🔗 関連する Structure Notes

-

## 📋 このトピックの Permanent Notes

-
```

### 10.5 `Templates/index-template.md`

```markdown
# {{title}}

## 📋 主要なトピック

### カテゴリ A

- [[]]

### カテゴリ B

- [[]]

## 🔗 Structure Notes 一覧

-
```

---

## 11. Obsidian API リファレンス

### 11.1 よく使う API

| クラス/メソッド | 用途 |
|-----------------|------|
| `App` | アプリケーションルートオブジェクト |
| `Plugin` | プラグインベースクラス |
| `TFile` | ファイルオブジェクト |
| `TFolder` | フォルダオブジェクト |
| `Vault` | ファイル操作 |
| `Workspace` | ワークスペース操作 |
| `MetadataCache` | メタデータキャッシュ |
| `FuzzySuggestModal` | 検索可能なモーダル |
| `ItemView` | カスタムビュー |
| `Notice` | 通知表示 |

### 11.2 ファイル操作

```typescript
// ファイル作成
await app.vault.create(path, content);

// ファイル読み取り
const content = await app.vault.read(file);

// ファイル更新
await app.vault.modify(file, newContent);

// ファイル移動/リネーム
await app.fileManager.renameFile(file, newPath);

// フォルダ作成
await app.vault.createFolder(path);

// フロントマター更新
await app.fileManager.processFrontMatter(file, (fm) => {
  fm.key = value;
});
```

### 11.3 メタデータ取得

```typescript
// ファイルキャッシュ取得
const cache = app.metadataCache.getFileCache(file);

// フロントマター
const frontmatter = cache?.frontmatter;

// リンク
const links = cache?.links;

// タグ
const tags = cache?.tags;

// バックリンク（内部API）
// @ts-ignore
const backlinks = app.metadataCache.getBacklinksForFile(file);
```

### 11.4 ワークスペース操作

```typescript
// アクティブファイル取得
const file = app.workspace.getActiveFile();

// ファイルを開く
await app.workspace.openLinkText(path, sourcePath);

// ビューを開く
await app.workspace.getLeaf('tab').setViewState({
  type: VIEW_TYPE,
  active: true,
});
```

---

## 12. 実装手順

### Phase 1: プロジェクト初期化（Day 1）

```bash
# 1. ディレクトリ作成
mkdir obsidian-page-zettel
cd obsidian-page-zettel

# 2. npm 初期化
npm init -y

# 3. 依存関係インストール
npm install --save-dev \
  typescript \
  @types/node \
  esbuild \
  obsidian

# 4. TypeScript 設定
# tsconfig.json を作成

# 5. esbuild 設定
# esbuild.config.mjs を作成

# 6. manifest.json 作成
# versions.json 作成
```

### Phase 1: 型定義（Day 1）

1. `src/types/note-types.ts` を作成
2. `src/types/settings.ts` を作成
3. `src/types/index.ts` でエクスポート

### Phase 1: コアサービス（Day 2-3）

1. `src/core/FrontmatterService.ts`
2. `src/services/FolderService.ts`
3. `src/services/TemplateService.ts`
4. `src/core/NoteManager.ts`

### Phase 1: UI（Day 3-4）

1. `src/ui/modals/NoteTypeModal.ts`
2. `styles.css`（モバイル対応）

### Phase 1: コマンド（Day 4-5）

1. `src/commands/ExtractSelectionCommand.ts`
2. `src/commands/index.ts`
3. `src/main.ts`（統合）

### Phase 1: 設定（Day 5）

1. `src/settings/defaults.ts`
2. `src/settings/SettingsTab.ts`

### Phase 2: 接続管理（Day 6-9）

1. `src/core/ConnectionManager.ts`
2. `src/services/SuggestionService.ts`
3. `src/ui/modals/StructureSuggestModal.ts`
4. `src/commands/PromoteNoteCommand.ts`
5. `src/commands/LinkToStructureCommand.ts`

### Phase 3: 可視化（Day 10-12）

1. `src/services/OrphanDetector.ts`
2. `src/ui/views/OrphanView.ts`
3. 設定画面の充実

---

## 13. テスト計画

### 13.1 手動テストシナリオ

| シナリオ | 期待結果 |
|----------|----------|
| デイリーノートでテキスト選択 → Extract | NoteTypeModal が表示 |
| Fleeting を選択 | 新規ノートが作成され、フロントマター付与 |
| 作成後の元ノート | リンクが挿入されている |
| Permanent を選択 | Structure 提案モーダルが表示 |
| Structure を選択 | 両方のノートにリンクが追加 |
| Fleeting ノートで Promote | Permanent に昇格、フォルダ移動 |
| 孤立ノートビューを開く | 未接続の Permanent が一覧表示 |

### 13.2 エッジケース

| ケース | 対応 |
|--------|------|
| 選択テキストが空 | Notice で警告 |
| 同名ファイルが存在 | 連番を付与 |
| フォルダが存在しない | 自動作成 |
| 昇格不可能なタイプ | Notice で通知 |
| テンプレートが存在しない | デフォルトコンテンツ使用 |

### 13.3 モバイルテスト

| 項目 | 確認ポイント |
|------|-------------|
| モーダル表示 | タップターゲットが十分な大きさ |
| コマンドパレット | 絵文字が正しく表示 |
| スクロール | スムーズなスクロール |
| 入力 | ソフトキーボードとの干渉なし |

---

## 付録: プロジェクト設定ファイル

### `package.json`

```json
{
  "name": "obsidian-page-zettel",
  "version": "0.1.0",
  "description": "Daily note-based Zettelkasten workflow for Obsidian",
  "main": "main.js",
  "scripts": {
    "dev": "node esbuild.config.mjs",
    "build": "node esbuild.config.mjs production",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@types/node": "^16.11.6",
    "@typescript-eslint/eslint-plugin": "^5.0.0",
    "@typescript-eslint/parser": "^5.0.0",
    "esbuild": "^0.17.0",
    "eslint": "^8.0.0",
    "obsidian": "latest",
    "typescript": "^5.0.0"
  }
}
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "inlineSourceMap": true,
    "inlineSources": true,
    "module": "ESNext",
    "target": "ES6",
    "allowJs": true,
    "noImplicitAny": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "isolatedModules": true,
    "strictNullChecks": true,
    "lib": ["DOM", "ES5", "ES6", "ES7"]
  },
  "include": ["src/**/*.ts"]
}
```

### `manifest.json`

```json
{
  "id": "obsidian-page-zettel",
  "name": "Page Zettel",
  "version": "0.1.0",
  "minAppVersion": "1.0.0",
  "description": "Daily note-based Zettelkasten workflow",
  "author": "Your Name",
  "authorUrl": "",
  "isDesktopOnly": false
}
```

### `esbuild.config.mjs`

```javascript
import esbuild from "esbuild";
import process from "process";

const prod = process.argv[2] === "production";

esbuild.build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  external: ["obsidian"],
  format: "cjs",
  target: "es2018",
  logLevel: "info",
  sourcemap: prod ? false : "inline",
  treeShaking: true,
  outfile: "main.js",
  watch: !prod,
}).catch(() => process.exit(1));
```

### `styles.css`

```css
/* ================================================
   Page Zettel - Mobile-First Styles
   ================================================ */

/* モーダル基本スタイル */
.page-zettel-modal {
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* ノートタイプ選択オプション */
.page-zettel-type-option {
  padding: 12px 16px;
  min-height: 48px;
  display: flex;
  align-items: center;
}

.page-zettel-type-container {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.page-zettel-type-icon {
  font-size: 1.5em;
  flex-shrink: 0;
}

.page-zettel-type-text {
  flex: 1;
}

.page-zettel-type-label {
  font-weight: 600;
  font-size: 1em;
}

.page-zettel-type-description {
  color: var(--text-muted);
  font-size: 0.85em;
  margin-top: 2px;
}

/* Structure 提案モーダル */
.page-zettel-structure-option {
  padding: 12px 16px;
  min-height: 48px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-zettel-skip-option {
  color: var(--text-muted);
  font-style: italic;
}

/* 孤立ノートビュー */
.page-zettel-orphan-view {
  padding: 16px;
}

.page-zettel-orphan-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.page-zettel-orphan-header h4 {
  margin: 0;
  flex: 1;
}

.page-zettel-orphan-stats {
  color: var(--text-muted);
  font-size: 0.9em;
}

.page-zettel-refresh-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
  padding: 8px;
  border-radius: 4px;
}

.page-zettel-refresh-btn:hover {
  background: var(--background-modifier-hover);
}

.page-zettel-orphan-empty {
  color: var(--text-success);
  padding: 24px;
  text-align: center;
  background: var(--background-secondary);
  border-radius: 8px;
}

.page-zettel-orphan-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.page-zettel-orphan-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid var(--background-modifier-border);
  gap: 12px;
}

.page-zettel-orphan-link {
  flex: 1;
  color: var(--text-accent);
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.page-zettel-orphan-link:hover {
  text-decoration: underline;
}

.page-zettel-orphan-actions {
  flex-shrink: 0;
}

.page-zettel-action-btn {
  min-width: 44px;
  min-height: 44px;
  padding: 8px 16px;
  border-radius: 4px;
  background: var(--interactive-accent);
  color: var(--text-on-accent);
  border: none;
  cursor: pointer;
  font-size: 0.9em;
}

.page-zettel-action-btn:hover {
  background: var(--interactive-accent-hover);
}

.page-zettel-action-btn:active {
  transform: scale(0.98);
}

/* モバイル対応 */
@media (max-width: 600px) {
  .page-zettel-orphan-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .page-zettel-orphan-actions {
    width: 100%;
  }

  .page-zettel-action-btn {
    width: 100%;
  }
}
```

---

## 付録: main.ts（エントリーポイント）

```typescript
import { Plugin, TFile } from 'obsidian';
import { PageZettelSettings } from './types/settings';
import { DEFAULT_SETTINGS } from './settings/defaults';
import { PageZettelSettingsTab } from './settings/SettingsTab';
import { NoteManager } from './core/NoteManager';
import { FrontmatterService } from './core/FrontmatterService';
import { ConnectionManager } from './core/ConnectionManager';
import { registerCommands } from './commands';
import { OrphanView, VIEW_TYPE_ORPHAN } from './ui/views/OrphanView';
import { StructureSuggestModal } from './ui/modals/StructureSuggestModal';

export default class PageZettelPlugin extends Plugin {
  settings: PageZettelSettings;
  noteManager: NoteManager;
  frontmatterService: FrontmatterService;
  connectionManager: ConnectionManager;

  async onload(): Promise<void> {
    // 設定読み込み
    await this.loadSettings();

    // サービス初期化
    this.frontmatterService = new FrontmatterService(this.app);
    this.noteManager = new NoteManager(this.app, this.settings);
    this.connectionManager = new ConnectionManager(this.app);

    // コマンド登録
    registerCommands(this, this.settings);

    // ビュー登録
    this.registerView(
      VIEW_TYPE_ORPHAN,
      (leaf) => new OrphanView(leaf, this)
    );

    // リボンアイコン
    this.addRibbonIcon('brain', 'Page Zettel', () => {
      this.showOrphanView();
    });

    // 設定タブ
    this.addSettingTab(new PageZettelSettingsTab(this.app, this));

    console.log('Page Zettel plugin loaded');
  }

  onunload(): void {
    console.log('Page Zettel plugin unloaded');
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  /**
   * 孤立ノートビューを表示
   */
  async showOrphanView(): Promise<void> {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_ORPHAN);

    if (existing.length) {
      this.app.workspace.revealLeaf(existing[0]);
      return;
    }

    await this.app.workspace.getRightLeaf(false)?.setViewState({
      type: VIEW_TYPE_ORPHAN,
      active: true,
    });
  }

  /**
   * ファイルを Structure Note に接続
   */
  async linkToStructure(file: TFile): Promise<void> {
    const modal = new StructureSuggestModal(
      this.app,
      this.settings,
      file,
      async (structureFile) => {
        if (structureFile) {
          await this.connectionManager.linkPermanentToStructure(file, structureFile);
        }
      }
    );
    modal.open();
  }
}
```
