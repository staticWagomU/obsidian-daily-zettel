import { App, FuzzySuggestModal, TFile, Notice } from "obsidian";
import { SuggestionService } from "../../services/suggestion-service";
import type { DailyZettelSettings } from "../../types/settings";

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
		settings: DailyZettelSettings,
		permanentNote: TFile,
		onSelect: (file: TFile | null) => void,
	) {
		super(app);
		this.permanentNote = permanentNote;
		this.onSelect = onSelect;
		this.suggestionService = new SuggestionService(app, settings);

		this.setPlaceholder("Structure Note を選択（またはスキップ）...");
		this.modalEl.addClass("daily-zettel-modal");

		// 提案を非同期で読み込み
		this.loadSuggestions();
	}

	private async loadSuggestions(): Promise<void> {
		this.suggestions = await this.suggestionService.suggestStructureNotes(
			this.permanentNote,
			10,
		);
		// 再描画をトリガー
		this.inputEl.dispatchEvent(new Event("input"));
	}

	getItems(): StructureOption[] {
		const options: StructureOption[] = [];

		// スキップオプションを最初に
		options.push({
			file: null,
			label: "⏭️ スキップ（後で接続）",
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

		el.addClass("daily-zettel-structure-option");

		if (option.isSkip) {
			el.addClass("daily-zettel-skip-option");
			el.createSpan({ text: option.label });
		} else {
			el.createSpan({ text: "🗂️ ", cls: "daily-zettel-structure-icon" });
			el.createSpan({ text: option.label });
		}
	}

	onChooseItem(item: StructureOption): void {
		if (item.isSkip) {
			new Notice("📝 後で Structure Note に接続できます");
			this.onSelect(null);
		} else {
			this.onSelect(item.file);
		}
	}
}
