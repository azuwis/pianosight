<script>
import { createEventDispatcher,  onDestroy } from 'svelte'
import WebMidi from 'webmidi'
import { sheetNotes } from './stores.js'

const dispatch = createEventDispatcher()
let playNotes = new Set()

function checkPlayNotes() {
  if ($sheetNotes.length !== 0 &&
      $sheetNotes.length <= playNotes.size &&
      $sheetNotes.every(value => playNotes.has(value))) {
    dispatch('match')
  }
}

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

onDestroy(() => {
  WebMidi.inputs[1].removeListener()
  WebMidi.disable()
})
</script>