<script>
import { onDestroy } from 'svelte'
import WebMidi from 'webmidi'
import { sheetNotes, playNotes, playMatch } from './stores.js'

let notes = new Set()

function checkPlayNotes() {
  if ($sheetNotes.length !== 0 &&
      $sheetNotes.length <= notes.size &&
      $sheetNotes.every(value => notes.has(value))) {
    $playMatch++
  }
}

WebMidi.enable((err) => {
  if (err) {
    console.log("WebMidi could not be enabled.", err)
    return
  }
  const input = WebMidi.inputs[1]
  input.addListener('noteon', 'all', event => {
    notes.add(event.note.number)
    $playNotes = notes
    checkPlayNotes()
  })
  input.addListener('noteoff', 'all', event => {
    notes.delete(event.note.number)
    $playNotes = notes
  })
})

onDestroy(() => {
  WebMidi.inputs[1].removeListener()
  WebMidi.disable()
})
</script>
