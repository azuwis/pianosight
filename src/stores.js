import { writable } from 'svelte/store'

export const sheetMusic = writable('easy.xml')
export const sheetNotes = writable([])
export const stavesToCheck = writable(new Set())
export const playNotes = writable(new Set())
export const playMatch = writable(0)
export const notification = writable('')
