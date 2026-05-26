/**
 * storage/index.ts
 *
 * Point d'entrée unique pour la couche data.
 * Pour changer de backend (Supabase, Firebase…) :
 *   remplacer localStorageAdapter par le nouvel adapter.
 */

export { localStorageAdapter as storage } from './localStorage'
export { exportData, importData } from './localStorage'
