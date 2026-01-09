import { App, FuzzySuggestModal } from "obsidian";
import { NoteType, NOTE_TYPE_CONFIG, NoteTypeConfig } from "../../types/note-types";

interface NoteTypeOption {
	type: NoteType;
	config: NoteTypeConfig;
}

export class NoteTypeModal extends FuzzySuggestModal<NoteTypeOption> {
	private onSelect: (type: NoteType) => void;
	private allowedTypes: NoteType[];

	constructor(app: App, onSelect: (type: NoteType) => void, allowedTypes?: NoteType[]) {
		super(app);
		this.onSelect = onSelect;
		this.allowedTypes = allowedTypes ?? ["fleeting", "literature", "permanent"];

		this.setPlaceholder("ノートタイプを選択...");
		this.modalEl.addClass("daily-zettel-modal");
	}

	getItems(): NoteTypeOption[] {
		return this.allowedTypes.map((type) => ({
			type,
			config: NOTE_TYPE_CONFIG[type],
		}));
	}

	getItemText(item: NoteTypeOption): string {
		return `${item.config.icon} ${item.config.label}`;
	}

	renderSuggestion(item: { item: NoteTypeOption }, el: HTMLElement): void {
		const option = item.item;

		el.addClass("daily-zettel-type-option");

		const container = el.createDiv({ cls: "daily-zettel-type-container" });

		// アイコン
		container.createSpan({
			text: option.config.icon,
			cls: "daily-zettel-type-icon",
		});

		// テキスト部分
		const textContainer = container.createDiv({ cls: "daily-zettel-type-text" });

		// ラベル
		textContainer.createDiv({
			text: option.config.label,
			cls: "daily-zettel-type-label",
		});

		// 説明
		textContainer.createDiv({
			text: option.config.description,
			cls: "daily-zettel-type-description",
		});
	}

	onChooseItem(item: NoteTypeOption): void {
		this.onSelect(item.type);
	}
}
