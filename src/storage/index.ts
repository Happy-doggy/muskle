/**
 * storage/index.ts
 *
 * Point d'entrée unique pour la couche data.
 * Pour changer de backend (Supabase, Firebase…) :
 *   remplacer localStorageAdapter par le nouvel adapter.
 */

export { firestoreAdapter as storage } from './firestore'
export { exportData, importData } from './localStorage'
