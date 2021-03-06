import { get, writable } from 'svelte/store'
import { isTouchScreen } from './utils.js'

export const sheetMusic = writable('')
export const sheetNotes = writable(new Map())
export const showSheetNotes = writable(true)
export const showKeyboard = writable(true)
export const showKeyboardControl = writable(false)
export const keyboardScale = writable(isTouchScreen ? 1.8 : 1.2)
export const allStaves = writable(new Set())
export const stavesToCheck = writable([])
export const playNotes = writable(new Set())
export const playMatch = writable(0)
export const notification = writable('')

export function checkPlayNotes() {
  const sn = get(sheetNotes)
  const pn = get(playNotes)
  const sc = get(stavesToCheck)
  let nc = []
  sn.forEach((notes, staff) => {
    if (sc.includes(staff)) {
      nc.push(...notes)
    }
  })
  if (nc.length !== 0 &&
    nc.length <= pn.size &&
    nc.every(value => pn.has(value))) {
    playMatch.update(n => n + 1)
  }
}
