// Re-export all stores for convenience
export { pb, currentUser } from './pocketbase';
export { notes, tags, collections, searchQuery, filteredNotes, initializeStores } from './notes';
export { searchIndex, searchNotes } from './search';
export { ui } from './ui';
