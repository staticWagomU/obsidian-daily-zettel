import { AbstractInputSuggest, App, TFile } from "obsidian";

export class FileSuggest extends AbstractInputSuggest<TFile> {
	private extension: string;

	constructor(app: App, inputEl: HTMLInputElement, extension = "md") {
		super(app, inputEl);
		this.extension = extension;
	}

	protected getSuggestions(query: string): TFile[] {
		return this.app.vault
			.getFiles()
			.filter((file) => file.extension === this.extension)
			.filter((file) => file.path.toLowerCase().includes(query.toLowerCase()));
	}

	renderSuggestion(file: TFile, el: HTMLElement): void {
		el.setText(file.path);
	}

	selectSuggestion(file: TFile, _evt: MouseEvent | KeyboardEvent): void {
		this.setValue(file.path);
		this.close();
	}
}
