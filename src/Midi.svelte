<script>
import { onDestroy } from 'svelte'
import WebMidi from 'webmidi'
import { playNotes, checkPlayNotes } from './stores.js'

let selectedInput = 'all'
let midiInputs = []
let midiListeners = {}

function midiConnected(event) {
  if (event.port.type === 'output') {
    return
  }
  midiInputs = WebMidi.inputs.map(input => input.name)
  if (selectedInput === 'all' || selectedInput === event.port.name) {
    addInputListener(event.port)
  }
}

function midiDisconnected(event) {
  if (event.port.type === 'output') {
    return
  }
  midiInputs = WebMidi.inputs.map(input => input.name)
  const name = event.port.name
  midiListeners[name] = false
  if (selectedInput === name) {
    selectedInput = 'all'
    addAllInputListeners()
  }
}

function noteOn(event) {
  $playNotes.add(event.note.number - 12)
  checkPlayNotes()
  $playNotes = $playNotes
}

function noteOff(event) {
  $playNotes.delete(event.note.number - 12)
  $playNotes = $playNotes
}

function addInputListener(input) {
  if (!midiListeners[input.name]) {
    midiListeners[input.name] = true
    input.addListener('noteon', 'all', noteOn)
    input.addListener('noteoff', 'all', noteOff)
  }
}

function addAllInputListeners() {
  WebMidi.inputs.forEach(addInputListener)
}

function removeAllInputListeners() {
  midiListeners = {}
  WebMidi.inputs.forEach(input => {
    input.removeListener()
  })
}

WebMidi.enable((err) => {
  if (err) {
    console.log("WebMidi could not be enabled.", err)
    return
  }
  midiListeners = {}
  WebMidi.addListener('connected', midiConnected)
  WebMidi.addListener('disconnected', midiDisconnected)
})

function onChange() {
  removeAllInputListeners()
  if (selectedInput === 'all') {
    addAllInputListeners()
  } else {
    const input = WebMidi.getInputByName(selectedInput)
    if (input) {
      addInputListener(input)
    }
  }
}

onDestroy(() => {
  removeAllInputListeners()
  WebMidi.removeListener()
  WebMidi.disable()
})
</script>

<!-- svelte-ignore a11y-no-onchange -->
<select bind:value={selectedInput} on:change={onChange}>
  <option value="all">
    All
  </option>
  {#each midiInputs as input}
  <option value={input}>
    {input}
  </option>
  {/each}
</select>
