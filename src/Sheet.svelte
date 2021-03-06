<script context="module">
import {
  sheetMusic,
  sheetNotes,
  showKeyboardControl,
  playNotes,
} from './stores.js'

let osmd
let sheet
let firstMeasure = 0
let lastMeasure = 0
let unsubPlayNotes = () => {}

function updateSheetNotes() {
  const sn = new Map()
  osmd.cursor.NotesUnderCursor().forEach(note => {
    const halfTone = note.halfTone
    if (halfTone > 0) {
      const staff = note.ParentStaff.Id
      if (sn.has(staff)) {
        sn.get(staff).push(halfTone)
      } else {
        sn.set(staff, [halfTone])
      }
    }
  })
  sheetNotes.set(sn)
  if (sn.size === 0) {
    goToNextNote()
  }
}

function scrollIntoView() {
  const top = osmd.cursor.cursorElement.offsetTop - 60
  const overflow = sheet.parentElement
  const behavior = Math.abs(overflow.scrollTop - top) < 400 ? 'smooth' : 'auto'
  overflow.scrollTo({behavior, top})
}

export function goToNextNote() {
  if (osmd.cursor.Iterator.EndReached) {
    return
  }
  osmd.cursor.next()
  if (osmd.cursor.Iterator.EndReached) {
    sheetNotes.set(new Map())
    osmd.cursor.hide()
    const reset = () => {
      showKeyboardControl.set(false)
      unsubPlayNotes()
    }
    let enabled = false
    let callCount = 0
    unsubPlayNotes = playNotes.subscribe(notes => {
      if (enabled) {
        callCount++
        if (callCount > 10) {
          reset()
          return
        }
        if (notes.size === 1) {
          if (notes.has(48)) { // C
            reset()
          } else if (notes.has(53)) { // F
            goTo(-1)
            reset()
          } else if (notes.has(55)) { // G
            goToFirstMeasure()
            reset()
          } else if (notes.has(57)) { // A
            goTo(1)
            reset()
          }
        }
      } else {
        if (notes.size === 0) {
          enabled = true
          showKeyboardControl.set(true)
        }
      }
    })
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
  osmd.cursor.resetIterator()
  let currentMeasure = getCurrentMeasure()
  while (currentMeasure >= 0 && currentMeasure < measure) {
    osmd.cursor.iterator.moveToNext()
    currentMeasure = getCurrentMeasure()
  }
  if (osmd.cursor.hidden) {
    osmd.cursor.show()
  }
  osmd.cursor.update()
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
  goToMeasure(firstMeasure)
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
</script>

<script>
import { onMount, onDestroy } from 'svelte'
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay'
import { debounce } from 'lodash-es'
import {
  allStaves,
  stavesToCheck,
  playMatch,
  notification
} from './stores.js'
import { goTo } from './File.svelte'

let innerWidth
let previousInnerWidth

$playMatch = 0

async function loadSheet(sheet) {
  $notification = 'Loading sheet...'
  removeOnMeasureClick()
  await osmd.load(sheet)
  osmd.zoom = 1
  setMargin()
  setTimeout(() => {
    osmd.render()
    osmd.cursor.show()
    addOnMeasureClick()
    $notification = ''
    firstMeasure = getCurrentMeasure()
    lastMeasure = osmd.Sheet.SourceMeasures.length + firstMeasure - 1
    updateSheetNotes()
    $allStaves = new Set(osmd.cursor.VoicesUnderCursor().map(v => v.ParentSourceStaffEntry.ParentStaff.Id))
    $stavesToCheck = Array.from($allStaves)
  }, 0)
}

function onMeasureClick(event) {
  goToMeasure(parseInt(event.target.innerHTML))
}

function addOnMeasureClick() {
  if (sheet) {
    sheet.querySelectorAll('text').forEach(text => {
      if (text.innerHTML.match(/^\d+$/)) {
        text.addEventListener('click', onMeasureClick)
      }
    })
  }
}

function removeOnMeasureClick() {
  if (sheet) {
    sheet.querySelectorAll('text').forEach(text => {
      if (text.innerHTML.match(/^\d+$/)) {
        text.removeEventListener('click', onMeasureClick)
      }
    })
  }
}

function setMargin() {
  const margin = innerWidth < 600 ? 2 : 5
  osmd.DrawingParameters.rules.PageLeftMargin = margin
  osmd.DrawingParameters.rules.PageRightMargin = margin
}

const reRender = debounce(() => {
  if (osmd && osmd.IsReadyToRender())
    removeOnMeasureClick()
    setMargin()
    osmd.render()
    addOnMeasureClick()
}, 200)

$: if (previousInnerWidth !== innerWidth) {
  if (previousInnerWidth) {
    reRender()
  }
  previousInnerWidth = innerWidth
}

$: if ($playMatch > 0) {
  goToNextNote()
}

onMount(() => {
  osmd = new OpenSheetMusicDisplay(sheet, {
    autoResize: false,
    drawingParameters: 'compact',
    followCursor: false
  })
  if (process.env.NODE_ENV !== 'production') {
    window.osmd = osmd
  }
  onDestroy(sheetMusic.subscribe(sheet => {
    if (sheet) {
      loadSheet(sheet)
    }
  }))
})

onDestroy(() => {
  unsubPlayNotes()
  removeOnMeasureClick()
})
</script>

<svelte:window bind:innerWidth={innerWidth}/>
<div bind:this={sheet}></div>
