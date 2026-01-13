# Page Zettel

[![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22page-zettel%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json)](https://obsidian.md/plugins?id=page-zettel)

**Obsidian用 Zettelkastenワークフローサポート** - Fleeting、Literature、Permanentノートを簡単に管理

[English README](README.md)

## ✨ 機能

### 📝 3種類のノートタイプ
Zettelkastenメソッドに基づいた3種類のノートで知識を管理：

| タイプ | 絵文字 | 用途 |
|--------|--------|------|
| **Fleeting** | 💭 | 後で処理するための素早いメモ・アイデア |
| **Literature** | 📚 | 外部ソース（書籍、記事など）からの要約・引用 |
| **Permanent** | 💎 | 原子的で相互に接続された知識の単位 |

### 🔄 Extract to Note（ノートへ抽出）
任意のノートでテキストを選択し、新しいノートとして抽出。元のテキストは自動的にマークダウンリンクに置き換わります。

### ⬆️ ノートのプロモーション
ノートを階層に沿って昇格（Fleeting → Permanent）。メタデータの自動更新とオプションでフォルダ移動も可能。

### 🔍 孤立ノート検出
他のノートにリンクされていないPermanentノートを発見。統計情報の表示と、孤立ノートの素早い接続が可能。

### 📱 モバイル最適化
スマートフォンやタブレットでもスムーズに使えるモバイルファーストデザイン。

### 🌐 国際化対応
英語・日本語インターフェースをフルサポート。

## 📦 インストール

### コミュニティプラグインから（推奨）
1. Obsidian設定 → コミュニティプラグイン を開く
2. セーフモードが有効な場合は無効にする
3. 「閲覧」をクリックして「Page Zettel」を検索
4. インストールして有効化

### 手動インストール
1. [最新リリース](https://github.com/staticWagomU/obsidian-daily-zettel/releases)から `main.js`、`styles.css`、`manifest.json` をダウンロード
2. フォルダを作成: `VaultFolder/.obsidian/plugins/page-zettel/`
3. ダウンロードしたファイルをフォルダにコピー
4. Obsidianを再読み込みし、設定 → コミュニティプラグイン でプラグインを有効化

## 🚀 使い方

### コマンド一覧

コマンドパレット（`Cmd/Ctrl + P`）からすべてのコマンドにアクセス：

| コマンド | 説明 |
|----------|------|
| 📝 **Extract to Note** | 選択テキストを新しいノートへ抽出（タイプ選択可） |
| 💭 **Extract to Fleeting** | Fleetingノートへ直接抽出 |
| 📚 **Extract to Literature** | Literatureノートへ直接抽出 |
| 💎 **Extract to Permanent** | Permanentノートへ直接抽出 |
| 📄 **Create New Note** | テンプレートから空のノートを作成 |
| ⬆️ **Promote Note** | 現在のノートを次のタイプへ昇格 |
| ⚡ **Quick Fleeting** | Fleetingを素早くキャプチャ |
| 🔗 **Show Orphan Notes** | 孤立ノート検出サイドバーを開く |

### 基本ワークフロー

#### アイデアのキャプチャ
1. **Quick Capture**: 「Quick Fleeting」で思いついたことを即座にメモ
2. **Extract & Create**: テキストを選択して「Extract to Note」で関連ノートを作成
3. **Direct Type**: コンテキストメニューからタイプ指定で直接抽出

#### ノートの処理
1. Fleetingノートを確認
2. 「Promote Note」で価値のあるアイデアをPermanentノートに昇格
3. 孤立ノート検出ビューでPermanentノート同士を接続

### コンテキストメニュー

選択テキストを右クリック：
- Fleetingノートへ抽出
- Literatureノートへ抽出
- Permanentノートへ抽出

## ⚙️ 設定

### ノートタイプ設定（タイプごと）

| 設定項目 | 説明 |
|----------|------|
| **Folder** | このタイプのノートを保存するフォルダ |
| **File Name Format** | ファイル命名テンプレート（プレースホルダー対応） |
| **Show Alias Input** | ノート作成時にエイリアス入力を表示 |
| **Template Path** | カスタムテンプレートファイルのパス |

### 動作設定

| 設定項目 | 説明 |
|----------|------|
| **Insert Link After Extract** | 抽出元にマークダウンリンクを挿入 |
| **Open After Extract** | 抽出後に新規ノートを開く |
| **Move On Promotion** | 昇格時にターゲットフォルダへ移動 |

### UI設定

| 設定項目 | 説明 |
|----------|------|
| **Show Emoji in Commands** | コマンド名に絵文字を表示 |
| **Mobile Optimized** | モバイルファーストUI最適化 |
| **Show Context Menu Items** | コンテキストメニューにノート操作を追加 |

## 📋 テンプレートプレースホルダー

カスタムテンプレートで使用可能なプレースホルダー：

| プレースホルダー | 説明 | 例 |
|------------------|------|-----|
| `{{content}}` | 選択テキスト（抽出時）または空（作成時） | 選択したテキスト... |
| `{{date}}` | 作成日 | 2024-01-15 |
| `{{time}}` | 作成時刻 | 14:30:00 |
| `{{datetime}}` | 日時 | 2024-01-15 14:30:00 |
| `{{title}}` | 生成されたファイル名 | マイノートタイトル |
| `{{alias}}` | ユーザー入力のエイリアス | エイリアス名 |
| `{{zettel-id}}` | Zettelkasten ID | 20240115143000 |

## 🤝 コントリビューション

コントリビューションを歓迎します！イシューやプルリクエストをお気軽にどうぞ。

### 開発環境セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/staticWagomU/obsidian-daily-zettel.git

# 依存関係をインストール
pnpm install

# プラグインをビルド
pnpm run build

# 開発モード（ウォッチ）
pnpm run dev

# Lintチェック
pnpm run lint
```

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) を参照してください。

## 🙏 謝辞

- Niklas LuhmannのZettelkastenメソッドにインスパイアされました
- [Obsidian Plugin API](https://docs.obsidian.md)で構築

---

**作者**: [staticWagomU](https://github.com/staticWagomU)
