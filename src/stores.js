import { writable } from 'svelte/store'

export const sheetMusic = writable('music.xml')
export const sheetNotes = writable([])
export const stavesToCheck = writable(new Set())
export const playMatch = writable(0)
