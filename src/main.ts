import {
	Editor,
	MarkdownView,
	Menu,
	MenuItem,
	Platform,
	Plugin,
	TFile,
	WorkspaceLeaf,
} from "obsidian";
import { DEFAULT_SETTINGS, PageZettelSettingTab } from "./settings";
import type { PageZettelSettings } from "./types/settings";
import { NoteManager } from "./core/note-manager";
import { PromotionService } from "./services/promotion-service";
import { FolderService } from "./services/folder-service";
import { TemplateService } from "./services/template-service";
import { FrontmatterService } from "./services/frontmatter-service";
import { NoteCreatorService } from "./services/note-creator-service";
import { extractSelection, extractSelectionToType } from "./commands/extract-selection-command";
import { promoteNote } from "./commands/promote-note-command";
import { OrphanView, VIEW_TYPE_ORPHAN } from "./ui/views/orphan-view";
import { QuickCaptureModal } from "./ui/modals/quick-capture-modal";
import { NoteTypeModal } from "./ui/modals/note-type-modal";
import { TitleInputModal } from "./ui/modals/title-input-modal";
import { NoteType } from "./types/note-types";
import { t } from "./i18n";
import { getIconForNoteType } from "./utils/icon-helper";
import { QuickAddWidget } from "./ui/widgets/quick-add-widget";

export default class PageZettelPlugin extends Plugin {
	settings: PageZettelSettings;
	noteManager: NoteManager;
	promotionService: PromotionService;
	noteCreatorService: NoteCreatorService;
	private quickAddWidget: QuickAddWidget | null = null;

	async onload() {
		await this.loadSettings();

		// Initialize folder structure on first load
		const folderService = new FolderService(this.app, this.settings);
		await folderService.initializeAllFolders();

		// Initialize services
		this.noteManager = new NoteManager(this.app, this.settings);
		this.promotionService = new PromotionService(this.app, this.settings);

		// Initialize NoteCreatorService
		const templateService = new TemplateService(this.app, this.settings);
		const frontmatterService = new FrontmatterService(this.app);
		this.noteCreatorService = new NoteCreatorService(
			this.app,
			this.settings,
			folderService,
			templateService,
			frontmatterService,
		);

		// Register views
		this.registerView(VIEW_TYPE_ORPHAN, (leaf) => new OrphanView(leaf, this.settings));

		// Add ribbon icon to open orphan view
		this.addRibbonIcon("unlink", t("ribbon.orphanView"), () => {
			void this.activateOrphanView();
		});

		// Register commands
		this.addCommand({
			id: "extract-selection",
			name: this.settings.ui.showEmojiInCommands
				? `📝 ${t("commands.extractToNote")}`
				: t("commands.extractToNote"),
			icon: "scissors",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				void extractSelection(this, editor, view);
			},
		});

		this.addCommand({
			id: "promote-note",
			name: this.settings.ui.showEmojiInCommands
				? `⬆️ ${t("commands.promoteNote")}`
				: t("commands.promoteNote"),
			icon: "arrow-up",
			callback: () => {
				void promoteNote(this);
			},
		});

		this.addCommand({
			id: "quick-fleeting",
			name: this.settings.ui.showEmojiInCommands
				? `⚡ ${t("commands.quickFleeting")}`
				: t("commands.quickFleeting"),
			icon: "zap",
			callback: () => {
				const modal = new QuickCaptureModal(this.app, this, (title: string) => {
					void (async () => {
						const file = await this.noteManager.createNote({
							title,
							type: "fleeting",
							content: "",
						});
						// 新規ノートを開く
						const leaf = this.app.workspace.getLeaf(false);
						await leaf.openFile(file);
					})();
				});
				modal.open();
			},
		});

		this.addCommand({
			id: "create-new-note",
			name: this.settings.ui.showEmojiInCommands
				? `📄 ${t("commands.createNewNote")}`
				: t("commands.createNewNote"),
			icon: "file-plus",
			callback: () => {
				const modal = new NoteTypeModal(
					this.app,
					this.settings,
					(type: NoteType) => {
						// 設定確認: showTitleInputフラグ
						const showTitleInput = this.settings[type].showTitleInput;

						if (!showTitleInput) {
							// showTitleInput=falseの場合、TitleInputModalをスキップしてノート作成
							void this.createNoteAndOpen(type, "");
							return;
						}

						// showTitleInput=trueの場合、TitleInputModalを表示
						const titleModal = new TitleInputModal(
							this.app,
							this,
							(result) => {
								void this.createNoteAndOpen(type, result.title);
							},
							false, // showRemoveIndent=false（Create時なのでインデント削除チェックボックス非表示）
						);
						titleModal.open();
					},
					["fleeting", "literature", "permanent"],
				);
				modal.open();
			},
		});

		// Register editor context menu
		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, _info) => {
				if (!this.settings.ui.showContextMenuItems) return;

				menu.addSeparator();

				// 選択テキストがある場合のみ表示（各ノートタイプに切り出す）
				if (editor.getSelection()) {
					const noteTypes: { type: NoteType; icon: string; translationKey: string }[] = [
						{
							type: "fleeting",
							icon: getIconForNoteType(this.settings, "fleeting"),
							translationKey: "commands.extractToFleeting",
						},
						{
							type: "literature",
							icon: getIconForNoteType(this.settings, "literature"),
							translationKey: "commands.extractToLiterature",
						},
						{
							type: "permanent",
							icon: getIconForNoteType(this.settings, "permanent"),
							translationKey: "commands.extractToPermanent",
						},
					];

					// サブメニューに項目を追加するヘルパー関数
					const addExtractItems = (targetMenu: Menu) => {
						for (const { type, icon, translationKey } of noteTypes) {
							targetMenu.addItem((item) =>
								item
									.setTitle(
										this.settings.ui.showEmojiInCommands
											? `${icon} ${t(translationKey)}`
											: t(translationKey),
									)
									.setIcon("file-plus")
									.onClick(() => {
										const view =
											this.app.workspace.getActiveViewOfType(MarkdownView);
										if (view) {
											void extractSelectionToType(this, editor, view, type);
										}
									}),
							);
						}
					};

					// デスクトップではサブメニュー、モバイルではフラットメニュー
					if (Platform.isDesktop) {
						menu.addItem((item) => {
							item.setSection("page-zettel")
								.setTitle(
									this.settings.ui.showEmojiInCommands
										? `📝 ${t("contextMenu.extractTo")}`
										: t("contextMenu.extractTo"),
								)
								.setIcon("scissors");
							// setSubmenu() は undocumented API なので型アサーションが必要
							const submenu = (
								item as MenuItem & { setSubmenu: () => Menu }
							).setSubmenu();
							addExtractItems(submenu);
						});
					} else {
						// モバイルではフラットに展開（サブメニューがタッチ操作で使いづらいため）
						addExtractItems(menu);
					}
				}

				// 常時表示
				menu.addItem((item) =>
					item
						.setSection("page-zettel")
						.setTitle(
							this.settings.ui.showEmojiInCommands
								? `⬆️ ${t("commands.promoteNote")}`
								: t("commands.promoteNote"),
						)
						.setIcon("arrow-up")
						.onClick(() => void promoteNote(this)),
				);
			}),
		);

		// Register file context menu
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				if (!this.settings.ui.showContextMenuItems) return;
				if (!(file instanceof TFile) || file.extension !== "md") return;

				menu.addSeparator();

				menu.addItem((item) =>
					item
						.setSection("page-zettel")
						.setTitle(
							this.settings.ui.showEmojiInCommands
								? `⬆️ ${t("commands.promoteNote")}`
								: t("commands.promoteNote"),
						)
						.setIcon("arrow-up")
						.onClick(() => void promoteNote(this)),
				);
			}),
		);

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new PageZettelSettingTab(this.app, this));

		// Initialize Quick Add Widget (FAB)
		this.initializeQuickAddWidget();

		// Register layout change event for FAB visibility
		this.registerEvent(
			this.app.workspace.on("layout-change", () => {
				if (this.quickAddWidget) {
					this.quickAddWidget.handleLayoutChange(this.app.workspace);
				}
			}),
		);
	}

	onunload() {
		// Clean up Quick Add Widget
		if (this.quickAddWidget) {
			this.quickAddWidget.remove();
			this.quickAddWidget = null;
		}
	}

	/**
	 * Quick Add Widget (FAB) を初期化
	 * モバイルではデフォルト表示、デスクトップでは設定に応じて表示
	 */
	private initializeQuickAddWidget(): void {
		// Create widget with QuickCaptureModal callback
		this.quickAddWidget = new QuickAddWidget(this.app, this.settings, () => {
			const modal = new QuickCaptureModal(this.app, this, (title: string) => {
				void (async () => {
					const file = await this.noteManager.createNote({
						title,
						type: "fleeting",
						content: "",
					});
					// 新規ノートを開く
					const leaf = this.app.workspace.getLeaf(false);
					await leaf.openFile(file);
				})();
			});
			modal.open();
		});

		// Determine visibility based on platform and settings
		const shouldShow = this.shouldShowQuickAddWidget();

		if (shouldShow) {
			this.quickAddWidget.show();
		}
	}

	/**
	 * Quick Add Widget を表示すべきかどうかを判定
	 * モバイル: デフォルトで表示（設定で無効化可能）
	 * デスクトップ: デフォルトで非表示（設定で有効化可能）
	 */
	private shouldShowQuickAddWidget(): boolean {
		// 設定で明示的に無効化されている場合は非表示
		if (!this.settings.ui.showQuickAddWidget) {
			return false;
		}

		// モバイルでは表示、デスクトップでも設定がtrueなら表示
		// デフォルト設定値がtrueなので、モバイル・デスクトップ両方で表示される
		// ユーザーが設定で無効化できる
		return true;
	}

	/**
	 * Quick Add Widget の表示/非表示を更新
	 * 設定変更時に呼び出される
	 */
	updateQuickAddWidget(): void {
		if (!this.quickAddWidget) return;

		const shouldShow = this.shouldShowQuickAddWidget();
		this.quickAddWidget.toggle(shouldShow);

		if (shouldShow) {
			this.quickAddWidget.updateSettings(this.settings);
		}
	}

	/**
	 * OrphanViewをアクティブにする
	 */
	async activateOrphanView(): Promise<void> {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_ORPHAN);

		if (leaves.length > 0) {
			// すでに開いている場合は、そのリーフを使用
			leaf = leaves[0] ?? null;
		} else {
			// 新しいリーフを右サイドバーに作成
			const rightLeaf = workspace.getRightLeaf(false);
			if (rightLeaf) {
				await rightLeaf.setViewState({ type: VIEW_TYPE_ORPHAN, active: true });
				leaf = rightLeaf;
			}
		}

		// リーフをアクティブにして表示
		if (leaf) {
			void workspace.revealLeaf(leaf);
		}
	}

	/**
	 * ノートを作成して開く
	 */
	async createNoteAndOpen(type: NoteType, alias: string): Promise<void> {
		// NoteCreatorServiceでノート作成
		const file = await this.noteCreatorService.createNote(type, "", alias);

		// 新規ノートを開く
		await this.app.workspace.openLinkText(file.path, "");
	}

	async loadSettings() {
		const savedData = (await this.loadData()) as Partial<PageZettelSettings> | null;
		this.settings = this.deepMergeSettings(DEFAULT_SETTINGS, savedData ?? {});
	}

	/**
	 * ネストされたオブジェクトを含む設定を深くマージする
	 */
	private deepMergeSettings(
		defaults: PageZettelSettings,
		saved: Partial<PageZettelSettings>,
	): PageZettelSettings {
		return {
			fleeting: { ...defaults.fleeting, ...saved.fleeting },
			literature: { ...defaults.literature, ...saved.literature },
			permanent: { ...defaults.permanent, ...saved.permanent },
			behavior: { ...defaults.behavior, ...saved.behavior },
			ui: { ...defaults.ui, ...saved.ui },
		};
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
