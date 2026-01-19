import { AbstractInputSuggest, App } from "obsidian";
import { type EmojiItem, EMOJI_CATALOG } from "../../data/emoji-catalog";

/**
 * 絵文字選択用のサジェストコンポーネント
 * AbstractInputSuggestパターンを使用
 */
export class EmojiSuggest extends AbstractInputSuggest<EmojiItem> {
	constructor(app: App, inputEl: HTMLInputElement) {
		super(app, inputEl);
	}

	/**
	 * 検索クエリに基づいて絵文字を絞り込む
	 * - 空クエリ: 全絵文字を表示
	 * - クエリあり: name、keywords、emoji自体でフィルタ
	 */
	protected getSuggestions(query: string): EmojiItem[] {
		const normalizedQuery = query.toLowerCase().trim();

		if (!normalizedQuery) {
			return EMOJI_CATALOG;
		}

		return EMOJI_CATALOG.filter((item) => {
			// 絵文字自体で検索
			if (item.emoji === query) {
				return true;
			}

			// 名前で検索
			if (item.name.toLowerCase().includes(normalizedQuery)) {
				return true;
			}

			// キーワードで検索
			return item.keywords.some((keyword) => keyword.toLowerCase().includes(normalizedQuery));
		});
	}

	/**
	 * サジェストアイテムを描画
	 * 絵文字 + 名前 + カテゴリを表示
	 */
	renderSuggestion(item: EmojiItem, el: HTMLElement): void {
		el.addClass("page-zettel-emoji-suggestion");

		const container = el.createDiv({ cls: "page-zettel-emoji-container" });

		// 絵文字アイコン（大きめ表示）
		container.createSpan({
			text: item.emoji,
			cls: "page-zettel-emoji-icon",
		});

		// テキスト部分
		const textContainer = container.createDiv({ cls: "page-zettel-emoji-text" });

		// 名前
		textContainer.createDiv({
			text: item.name,
			cls: "page-zettel-emoji-name",
		});

		// カテゴリ（小さめ表示）
		textContainer.createDiv({
			text: item.category,
			cls: "page-zettel-emoji-category",
		});
	}

	/**
	 * サジェスト選択時の処理
	 * 入力フィールドに絵文字をセット
	 */
	selectSuggestion(item: EmojiItem, _evt: MouseEvent | KeyboardEvent): void {
		this.setValue(item.emoji);
		this.close();
	}
}
