// Core entity types for Homelab Notebook

export type EntryMode = 'research' | 'project' | 'reference';
export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived';
export type TagCategory = 'technology' | 'concept' | 'infrastructure' | 'other';

// Attachment stored in Tigris, metadata in PocketBase
export interface Attachment {
	key: string; // Tigris storage key (e.g., entries/{entryId}/{timestamp}-{filename})
	publicUrl: string; // Direct URL to file
	filename: string; // Original filename
	size?: number; // File size in bytes
}

export interface Entry {
	id: string;
	mode: EntryMode;
	title: string;
	content: string;
	url?: string;
	language?: string;
	project?: string;
	tags: string[];
	linked_entries: string[];
	promoted_from?: string;
	attachments: Attachment[]; // Tigris file metadata (stored as JSON in PocketBase)
	archived: boolean;
	created: string;
	updated: string;
	// Expanded relations (populated by PocketBase)
	expand?: {
		project?: Project;
		tags?: Tag[];
		linked_entries?: Entry[];
		promoted_from?: Entry;
	};
}

export interface Project {
	id: string;
	name: string;
	description?: string;
	status: ProjectStatus;
	color?: string;
	created: string;
	updated: string;
}

export interface Tag {
	id: string;
	name: string;
	category?: TagCategory;
	color?: string;
	auto_generated: boolean;
}

// Form types for creating/editing
export interface EntryFormData {
	mode: EntryMode;
	title: string;
	content: string;
	url?: string;
	language?: string;
	project?: string;
	tags: string[];
	linked_entries?: string[];
	promoted_from?: string;
	attachments?: Attachment[]; // Tigris attachment metadata
}

export interface ProjectFormData {
	name: string;
	description?: string;
	status: ProjectStatus;
	color?: string;
}

export interface TagFormData {
	name: string;
	category?: TagCategory;
	color?: string;
}

// UI state types
export interface SearchFilters {
	mode?: EntryMode;
	project?: string;
	tags?: string[];
	archived?: boolean;
	dateFrom?: string;
	dateTo?: string;
}

export interface SearchResult {
	entry: Entry;
	score: number;
	matches: string[];
}

// Mode metadata for UI
export interface ModeConfig {
	id: EntryMode;
	label: string;
	icon: string;
	color: string;
	bgColor: string;
	description: string;
}

export const MODE_CONFIGS: Record<EntryMode, ModeConfig> = {
	research: {
		id: 'research',
		label: 'Research',
		icon: 'BookOpen',
		color: 'text-blue-600',
		bgColor: 'bg-blue-50',
		description: 'Resources, links, and articles'
	},
	project: {
		id: 'project',
		label: 'Project',
		icon: 'Wrench',
		color: 'text-amber-600',
		bgColor: 'bg-amber-50',
		description: 'Developer journal and logs'
	},
	reference: {
		id: 'reference',
		label: 'Reference',
		icon: 'FileText',
		color: 'text-green-600',
		bgColor: 'bg-green-50',
		description: 'Tutorials and documentation'
	}
};

// Project status metadata
export interface StatusConfig {
	id: ProjectStatus;
	label: string;
	color: string;
	dotColor: string;
}

export const STATUS_CONFIGS: Record<ProjectStatus, StatusConfig> = {
	active: {
		id: 'active',
		label: 'Active',
		color: 'text-green-600',
		dotColor: 'bg-green-500'
	},
	paused: {
		id: 'paused',
		label: 'Paused',
		color: 'text-yellow-600',
		dotColor: 'bg-yellow-500'
	},
	completed: {
		id: 'completed',
		label: 'Completed',
		color: 'text-blue-600',
		dotColor: 'bg-blue-500'
	},
	archived: {
		id: 'archived',
		label: 'Archived',
		color: 'text-gray-500',
		dotColor: 'bg-gray-400'
	}
};
