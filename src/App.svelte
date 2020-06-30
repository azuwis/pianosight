<script>
import { stavesToCheck } from './stores.js'
import Sheet from './Sheet.svelte'
import Keyboard from './Keyboard.svelte'
import Midi from './Midi.svelte'
import File from './File.svelte'

let numbers = []
let sheet
let file
let keyboard = true

function handleKeydown(event) {
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
      keyboard = !keyboard
      break
    case 'o':
      file.open()
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
        sheet.goToMeasure(parseInt(numbers.join('')))
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

<svelte:window on:keydown={handleKeydown}/>
<span class="fixed right-0 bg-gray-400 rounded-bl px-1">{numbers.join('')}</span>
<File bind:this={file}/>
<div class:pb-16={keyboard}>
  <Sheet bind:this={sheet}/>
</div>
{#if keyboard}
<div class="fixed bottom-0 w-screen flex justify-center">
  <Keyboard/>
</div>
{/if}
<Midi/>
