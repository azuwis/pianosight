import { get, writable } from 'svelte/store'

export const sheetMusic = writable('easy.xml')
export const sheetNotes = writable([])
export const stavesToCheck = writable(new Set())
export const playNotes = writable(new Set())
export const playMatch = writable(0)
export const notification = writable('')

export function checkPlayNotes() {
    const sn = get(sheetNotes)
    const pn = get(playNotes)
    if (sn.length !== 0 &&
      sn.length <= pn.size &&
      sn.every(value => pn.has(value))) {
        playMatch.update(n => n + 1)
  }
}
