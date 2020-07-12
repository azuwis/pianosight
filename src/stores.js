import { get, writable } from 'svelte/store'

export const sheetMusic = writable('lesson1.mxl')
export const sheetNotes = writable(new Map())
export const showSheetNotes = writable(true)
export const showKeyboard = writable(true)
export const showKeyboardControl = writable(false)
export const keyboardScale = writable(1.2)
export const stavesToCheck = writable(new Set())
export const playNotes = writable(new Set())
export const playMatch = writable(0)
export const notification = writable('')

export function checkPlayNotes() {
  const sn = get(sheetNotes)
  const pn = get(playNotes)
  const sc = get(stavesToCheck)
  let nc = []
  sn.forEach((notes, staff) => {
    if (sc.size === 0 || sc.has(staff)) {
      nc.push(...notes)
    }
  })
  if (nc.length !== 0 &&
      nc.length <= pn.size &&
      nc.every(value => pn.has(value))) {
    playMatch.update(n => n + 1)
  }
}
