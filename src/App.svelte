<script>
import { onMount, onDestroy } from 'svelte'
import opensheetmusicdisplay from 'opensheetmusicdisplay'
import WebMidi from 'webmidi'

let osmd
let container
let sheetNotes = []
let playNotes = new Set()
let stavesToCheck = new Set()
let firstMeasure = 0
let lastMeasure = 0
let numbers = []

function updateSheetNotes() {
  sheetNotes = osmd.cursor.NotesUnderCursor()
    .filter(n => n.halfTone > 0 &&
      (stavesToCheck.size === 0 || stavesToCheck.has(n.ParentStaff.Id)))
    .map(n => n.halfTone + 12)
}

function checkPlayNotes() {
  if (sheetNotes.length <= playNotes.size &&
      sheetNotes.every(value => playNotes.has(value))) {
    goToNextNote()
  }
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
  if (measure < 0) {
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
      stavesToCheck = new Set(numbers)
      numbers = []
      updateSheetNotes()
      break
  }
}

onMount(async() => {
  osmd = new opensheetmusicdisplay.OpenSheetMusicDisplay(container, {
    followCursor: true
  })
  await osmd.load('music.xml')
  osmd.render()
  osmd.cursor.show()
  window.osmd = osmd

  firstMeasure = getCurrentMeasure()
  lastMeasure = osmd.Sheet.SourceMeasures.length + firstMeasure - 1
  updateSheetNotes()

  WebMidi.enable((err) => {
    if (err) {
      console.log("WebMidi could not be enabled.", err)
      return
    }
    const input = WebMidi.inputs[1]
    input.addListener('noteon', 'all', event => {
      playNotes.add(event.note.number)
      checkPlayNotes()
    })
    input.addListener('noteoff', 'all', event => {
      playNotes.delete(event.note.number)
      checkPlayNotes()
    })
  })
})

onDestroy(() => {
  WebMidi.inputs[1].removeListener()
  WebMidi.disable()
})
</script>

<svelte:window on:keydown={handleKeydown}/>
<div>{sheetNotes}</div>
<div class="container" bind:this={container}></div>
