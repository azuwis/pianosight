import { writable } from 'svelte/store'

export const sheetNotes = writable([])
export const stavesToCheck = writable(new Set())
