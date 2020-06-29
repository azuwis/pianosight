<script>
import { onMount } from 'svelte'
import opensheetmusicdisplay from 'opensheetmusicdisplay'
import { sheetMusic, sheetNotes, stavesToCheck } from './stores.js'
import Midi from './Midi.svelte'

let osmd
let container
let firstMeasure = 0
let lastMeasure = 0
let numbers = []

async function loadSheet(sheet) {
  await osmd.load(sheet)
  osmd.render()
  osmd.cursor.show()
  firstMeasure = getCurrentMeasure()
  lastMeasure = osmd.Sheet.SourceMeasures.length + firstMeasure - 1
  updateSheetNotes()
}

function updateSheetNotes() {
  if (!osmd.cursor) {
    return
  }
  $sheetNotes = osmd.cursor.NotesUnderCursor()
    .filter(n => n.halfTone > 0 &&
      ($stavesToCheck.size === 0 || $stavesToCheck.has(n.ParentStaff.Id)))
    .map(n => n.halfTone + 12)
}

function goToNextNote() {
  osmd.cursor.next()
  updateSheetNotes()
}

function getCurrentMeasure() {
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

function goToMeasure(measure) {
  if (measure < firstMeasure || measure > lastMeasure) {
    return
  }
  osmd.cursor.reset()
  let currentMeasure = getCurrentMeasure()
  while (currentMeasure >= 0 && currentMeasure < measure) {
    osmd.cursor.next()
    currentMeasure = getCurrentMeasure()
  }
  updateSheetNotes()
}

function goToPreviousMeasure() {
  goToMeasure(getCurrentMeasure() - 1)
}

function goToNextMeasure() {
  goToMeasure(getCurrentMeasure() + 1)
}

function goToFirstMeasure() {
  osmd.cursor.reset()
  updateSheetNotes()
}

function goToLastMeasure() {
  goToMeasure(lastMeasure)
}

function goToPreviousLine() {
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

function goToNextLine() {
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

function handleKeydown(event) {
  switch(event.key) {
    case 'n':
      goToNextNote()
      break
    case 'h':
      goToPreviousMeasure()
      break
    case 'l':
      goToNextMeasure()
      break
    case 'k':
      goToPreviousLine()
      break
    case 'j':
      goToNextLine()
      break
    case 'r':
      goToFirstMeasure()
      break
    case 'G':
      goToLastMeasure()
      break
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      numbers.push(parseInt(event.key))
      break
    case 'g':
      if (numbers.length > 0) {
        goToMeasure(parseInt(numbers.join('')))
        numbers = []
      }
      break
    case 's':
      $stavesToCheck = new Set(numbers)
      numbers = []
      break
  }
}

onMount(async() => {
  osmd = new opensheetmusicdisplay.OpenSheetMusicDisplay(container, {
    followCursor: true
  })
  sheetMusic.subscribe(sheet => {
    loadSheet(sheet)
  })
  stavesToCheck.subscribe(() => {
    updateSheetNotes()
  })
})
</script>

<svelte:window on:keydown={handleKeydown}/>
<div>{$sheetNotes}</div>
<div bind:this={container}></div>
<Midi on:match={goToNextNote}/>
