<script>
import { onMount, onDestroy } from 'svelte'
import opensheetmusicdisplay from 'opensheetmusicdisplay'
import {
  sheetMusic,
  sheetNotes,
  showKeyboard,
  showKeyboardControl,
  stavesToCheck,
  playNotes,
  playMatch,
  notification
} from './stores.js'

export let file

let osmd
let sheet
let firstMeasure = 0
let lastMeasure = 0

async function loadSheet(sheet) {
  $notification = 'loading...'
  await osmd.load(sheet)
  osmd.zoom = 1
  osmd.render()
  osmd.cursor.show()
  $notification = ''
  firstMeasure = getCurrentMeasure()
  lastMeasure = osmd.Sheet.SourceMeasures.length + firstMeasure - 1
  updateSheetNotes()
}

function updateSheetNotes() {
  $sheetNotes = osmd.cursor.NotesUnderCursor()
    .filter(n => n.halfTone > 0 &&
      ($stavesToCheck.size === 0 || $stavesToCheck.has(n.ParentStaff.Id)))
    .map(n => n.halfTone)
}

function scrollIntoView() {
  const cursorElement = osmd.cursor.cursorElement
  const diff = cursorElement.getBoundingClientRect().top
  const top = diff + window.pageYOffset - 60
  window.scrollTo({
    behavior: diff > -1000 && diff < 1000 ? 'smooth' : 'auto',
    top
  })
}

export function goToNextNote() {
  if (osmd.cursor.Iterator.EndReached) {
    return
  }
  osmd.cursor.next()
  if (osmd.cursor.Iterator.EndReached) {
    $showKeyboardControl = true
    const unsub = playNotes.subscribe(notes => {
      if (notes.size === 1) {
        if (notes.has(53)) {
          file.goTo(-1)
          reset()
        } else if (notes.has(55)) {
          goToFirstMeasure()
          reset()
        } else if (notes.has(57)) {
          file.goTo(1)
          reset()
        }
      }
    })
    function reset() {
      $showKeyboardControl = false
      unsub()
    }
    setTimeout(reset, 5000)
    return
  }
  scrollIntoView()
  updateSheetNotes()
}

function getCurrentMeasure() {
  if (osmd.cursor.Iterator.EndReached) {
    return lastMeasure
  }
  const currentMeasure = osmd.cursor
    .VoicesUnderCursor()[0].ParentSourceStaffEntry
    .VerticalContainerParent.ParentMeasure
  if (currentMeasure) {
    return currentMeasure.MeasureNumber
  } else {
    return -1
  }
}

function getMeasuresInLine(measure) {
  if (measure < firstMeasure) {
    return null
  }
  return osmd.GraphicSheet.MeasureList[measure - firstMeasure][0]
    .ParentStaffLine.Measures
}

export function goToMeasure(measure) {
  if (measure < firstMeasure || measure > lastMeasure) {
    return
  }
  osmd.cursor.reset()
  let currentMeasure = getCurrentMeasure()
  while (currentMeasure >= 0 && currentMeasure < measure) {
    osmd.cursor.next()
    currentMeasure = getCurrentMeasure()
  }
  scrollIntoView()
  updateSheetNotes()
}

export function goToPreviousMeasure() {
  goToMeasure(getCurrentMeasure() - 1)
}

export function goToNextMeasure() {
  goToMeasure(getCurrentMeasure() + 1)
}

export function goToFirstMeasure() {
  osmd.cursor.reset()
  scrollIntoView()
  updateSheetNotes()
}

export function goToLastMeasure() {
  goToMeasure(lastMeasure)
}

export function goToPreviousLine() {
  const measuresInLine = getMeasuresInLine(getCurrentMeasure())
  if (!measuresInLine) {
    return
  }
  const firstMeasureOfLine = measuresInLine[0].measureNumber
  const measuresInPreviousLine = getMeasuresInLine(
    firstMeasureOfLine - 1
  )
  if (!measuresInPreviousLine) {
    return
  }
  const firstMeasureOfPreviousLine =
    measuresInPreviousLine[0].MeasureNumber
  goToMeasure(firstMeasureOfPreviousLine)
}

export function goToNextLine() {
  const measuresInLine = getMeasuresInLine(getCurrentMeasure())
  if (!measuresInLine) {
    return
  }
  const lastMeasureOfLine = measuresInLine.last().MeasureNumber
  const nextMeasure = lastMeasureOfLine + 1
  if (nextMeasure > osmd.GraphicSheet.MeasureList.length) {
    return
  }
  goToMeasure(nextMeasure)
}

$: if ($playMatch > 0) {
  goToNextNote()
}

onMount(() => {
  osmd = new opensheetmusicdisplay.OpenSheetMusicDisplay(sheet, {
    autoResize: false,
    followCursor: false
  })
  onDestroy(sheetMusic.subscribe(sheet => {
    loadSheet(sheet)
  }))
  onDestroy(stavesToCheck.subscribe(() => {
    if (osmd.cursor) {
      updateSheetNotes()
    }
  }))
  $playMatch = 0
})
</script>

<div bind:this={sheet} class:mb-16={$showKeyboard}></div>
