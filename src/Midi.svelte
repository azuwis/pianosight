<script>
import { onDestroy } from 'svelte'
import WebMidi from 'webmidi'
import { playNotes, checkPlayNotes } from './stores.js'

WebMidi.enable((err) => {
  if (err) {
    console.log("WebMidi could not be enabled.", err)
    return
  }
  const input = WebMidi.inputs[1]
  input.addListener('noteon', 'all', event => {
    $playNotes.add(event.note.number - 12)
    checkPlayNotes()
    $playNotes = $playNotes
  })
  input.addListener('noteoff', 'all', event => {
    $playNotes.delete(event.note.number - 12)
    $playNotes = $playNotes
  })
})

onDestroy(() => {
  WebMidi.inputs[1].removeListener()
  WebMidi.disable()
})
</script>
