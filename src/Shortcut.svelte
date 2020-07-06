<script>
import {
  showSheetNotes,
  showKeyboard,
  stavesToCheck,
  notification
} from './stores.js'

export let file
export let sheet
let numbers = []

$: $notification = numbers.join('')

function onKeydown(event) {
  if (event.ctrlKey || event.metaKey) {
    return
  }
  switch(event.key) {
    case 'n':
      sheet.goToNextNote()
      break
    case 'h':
      sheet.goToPreviousMeasure()
      break
    case 'l':
      sheet.goToNextMeasure()
      break
    case 'k':
      sheet.goToPreviousLine()
      break
    case 'j':
      sheet.goToNextLine()
      break
    case 'r':
      sheet.goToFirstMeasure()
      break
    case 'G':
      sheet.goToLastMeasure()
      break
    case 'p':
      $showKeyboard = !$showKeyboard
      break
    case 'o':
      file.open()
      break
    case 'w':
      file.goTo(1)
      break
    case 'q':
      file.goTo(-1)
      break
    case 'i':
      $showSheetNotes = !$showSheetNotes
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
      numbers = [...numbers, parseInt(event.key)]
      break
    case 'g':
      if (numbers.length > 0) {
        sheet.goToMeasure(numbers.reduce((acc, cur) => acc * 10 + cur))
        numbers = []
      }
      break
    case 's':
      $stavesToCheck = new Set(numbers)
      numbers = []
      break
    case 'Escape':
      numbers = []
      break
  }
}
</script>

<svelte:window on:keydown={onKeydown}/>
