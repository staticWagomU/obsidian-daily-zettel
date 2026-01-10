export type { NoteType, NoteTypeConfig, NoteMetadata, NoteStatus } from "./note-types";
export type { PageZettelSettings, FolderSettings, BehaviorSettings, UISettings } from "./settings";

export { NOTE_TYPE_CONFIG, PROMOTION_PATHS } from "./note-types";

export interface OrphanStats {
	total: number;
	orphans: number;
	connected: number;
	connectionRate: number;
}
