<script>
import { updateServiceWorker } from './register.js'
import {
  showSheetNotes,
  showKeyboard,
  keyboardScale,
  allStaves,
  stavesToCheck,
  notification,
} from './stores.js'
import { selectedFile, open, goTo } from './File.svelte'
import { generate } from './SheetGenerator.svelte'

export let sheet
let showShortcut = false
let numbers = []

$: $notification = numbers.join('')

function onKeydown(event) {
  if (event.ctrlKey || event.metaKey) {
    return
  }
  switch(event.key) {
    case '?':
      toggleHint()
      break
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
    case 'y':
      if ($selectedFile === 'generate') {
        generate()
      } else {
        $selectedFile = 'generate'
      }
      break
    case 'p':
      $showKeyboard = !$showKeyboard
      break
    case 'o':
      open()
      break
    case 'w':
      goTo(1)
      break
    case 'q':
      goTo(-1)
      break
    case 'i':
      $showSheetNotes = !$showSheetNotes
      break
    case '+':
      $keyboardScale *= 1.2
      break
    case '-':
      $keyboardScale /= 1.2
      break
    case '=':
      $keyboardScale = 1.2
      break
    case 'u':
      updateServiceWorker()
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
      if (numbers.length === 0) {
        $stavesToCheck = Array.from($allStaves)
      } else {
        $stavesToCheck = Array.from(new Set(numbers))
        numbers = []
      }
      break
    case 'Escape':
      numbers = []
      break
  }
}

function toggleHint() {
  showShortcut = !showShortcut
}
</script>

<svelte:window on:keydown={onKeydown}/>
{#if showShortcut}
<div on:click={toggleHint} class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25">
  <div class="grid grid-cols-1 md:grid-cols-2 row-gap-1 col-gap-4 py-4 px-6 bg-white text-lg border-t border-r border-l rounded-lg shadow-md">
    <div><kbd>h</kbd>Previous measure</div>
    <div><kbd>l</kbd>Next measure</div>
    <div><kbd>k</kbd>Previous line</div>
    <div><kbd>j</kbd>Next line</div>
    <div><kbd>r</kbd>First measure</div>
    <div><kbd>G</kbd>Last measure</div>
    <div><kbd>q</kbd>Previous sheet</div>
    <div><kbd>w</kbd>Next sheet</div>
    <div><kbd>o</kbd>Open files</div>
    <div><kbd>0123456789</kbd>Set number</div>
    <div><kbd>g</kbd>Go to measure number</div>
    <div><kbd>s</kbd>Staff to check</div>
    <div><kbd>n</kbd>Next note</div>
    <div><kbd>p</kbd>Show/hide keyboard</div>
    <div><kbd>i</kbd>Show/hide key hint</div>
    <div><kbd>?</kbd>Show/hide this hint</div>
  </div>
</div>
{/if}

<style>
kbd {
  @apply inline-block bg-gray-500 rounded-lg px-3 mr-1;
}
</style>
