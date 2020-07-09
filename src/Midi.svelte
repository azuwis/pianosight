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
  if (WebMidi.enabled) {
    removeAllInputListeners()
    WebMidi.removeListener()
    WebMidi.disable()
  }
})
</script>

<!-- svelte-ignore a11y-no-onchange -->
<select bind:value={selectedInput} on:change={onChange} class="ml-1">
  <option value="all">
    All
  </option>
  {#each midiInputs as input}
  <option value={input}>
    {input}
  </option>
  {/each}
</select>

<style>
select {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23718096' d='M17 8v1.994A1.999 1.999 0 0114.994 12H11v4.268a2 2 0 11-2 0V14H5.006A1.999 1.999 0 013 11.994V9.732a2 2 0 112 0V12h4V4H7l3-4 3 4h-2v6h4V8h-1V4h4v4h-1z'/%3E%3C/svg%3E");
  background-size: 1em 1em;
}
</style>
