import { writable, derived } from 'svelte/store';
import type { Project, ProjectFormData, ProjectStatus } from '$lib/types';
import { projectService } from '$lib/services/pocketbase';
import { browser } from '$app/environment';

// Core projects store
function createProjectsStore() {
	const { subscribe, set, update } = writable<Project[]>([]);

	return {
		subscribe,
		set,

		async load(includeArchived = false) {
			if (!browser) return;
			try {
				const projects = await projectService.getAll(includeArchived);
				set(projects);
			} catch (error) {
				console.error('Failed to load projects:', error);
			}
		},

		async create(data: ProjectFormData) {
			const project = await projectService.create(data);
			update((projects) => [project, ...projects]);
			return project;
		},

		async update(id: string, data: Partial<ProjectFormData>) {
			const updated = await projectService.update(id, data);
			update((projects) => projects.map((p) => (p.id === id ? updated : p)));
			return updated;
		},

		async updateStatus(id: string, status: ProjectStatus) {
			return this.update(id, { status });
		},

		async delete(id: string) {
			await projectService.delete(id);
			update((projects) => projects.filter((p) => p.id !== id));
		},

		// Handle real-time updates
		handleRealtimeUpdate(action: string, record: Project) {
			update((projects) => {
				switch (action) {
					case 'create':
						return [record, ...projects];
					case 'update':
						return projects.map((p) => (p.id === record.id ? record : p));
					case 'delete':
						return projects.filter((p) => p.id !== record.id);
					default:
						return projects;
				}
			});
		}
	};
}

export const projects = createProjectsStore();

// Derived stores by status
export const activeProjects = derived(projects, ($projects) =>
	$projects.filter((p) => p.status === 'active')
);

export const pausedProjects = derived(projects, ($projects) =>
	$projects.filter((p) => p.status === 'paused')
);

export const completedProjects = derived(projects, ($projects) =>
	$projects.filter((p) => p.status === 'completed')
);

export const archivedProjects = derived(projects, ($projects) =>
	$projects.filter((p) => p.status === 'archived')
);

// Non-archived projects for sidebar
export const visibleProjects = derived(projects, ($projects) =>
	$projects.filter((p) => p.status !== 'archived')
);

// Project counts
export const projectCounts = derived(projects, ($projects) => ({
	active: $projects.filter((p) => p.status === 'active').length,
	paused: $projects.filter((p) => p.status === 'paused').length,
	completed: $projects.filter((p) => p.status === 'completed').length,
	archived: $projects.filter((p) => p.status === 'archived').length,
	total: $projects.length
}));

// Current project being viewed
export const currentProject = writable<Project | null>(null);
