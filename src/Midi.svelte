<script context="module">
import { get, writable } from 'svelte/store'
import WebMidi from 'webmidi'
import { playNotes, checkPlayNotes } from './stores.js'

let selectedInput = 'all'
let midiInputs = writable([])
let midiListeners = {}

function midiConnected(event) {
  if (event.port.type === 'output') {
    return
  }
  midiInputs.set(WebMidi.inputs.map(input => input.name))
  if (selectedInput === 'all' || selectedInput === event.port.name) {
    addInputListener(event.port)
  }
}

function midiDisconnected(event) {
  if (event.port.type === 'output') {
    return
  }
  midiInputs.set(WebMidi.inputs.map(input => input.name))
  const name = event.port.name
  midiListeners[name] = false
  if (selectedInput === name) {
    selectedInput = 'all'
    addAllInputListeners()
  }
}

function noteOn(event) {
  const pn = get(playNotes)
  pn.add(event.note.number - 12)
  checkPlayNotes()
  playNotes.set(pn)
}

function noteOff(event) {
  playNotes.update(pn => {
    pn.delete(event.note.number - 12)
    return pn
  })
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
</script>

<!-- svelte-ignore a11y-no-onchange -->
<select bind:value={selectedInput} on:change={onChange} class="form-select" title="MIDI devices">
  <option value="all">
    All Midi Inputs
  </option>
  {#each $midiInputs as input}
  <option value={input}>
    {input}
  </option>
  {/each}
</select>

<style>
.form-select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 58.62 58.62' fill='%23718096'%3E%3Cpath d='M43.77 33.941l14.849-14.849L39.528 0 24.679 14.849l-.06-.06c-.74-.739-1.723-1.147-2.769-1.147s-2.029.408-2.768 1.147L8.355 25.516c-.739.739-1.146 1.723-1.146 2.769s.407 2.028 1.146 2.768l6.424 6.425L7 45.257l1.061 1.061-7.182 7.181a3.002 3.002 0 002.122 5.121c.801 0 1.554-.313 2.121-.879l7.182-7.182 1.061 1.061 7.778-7.778 6.424 6.425c.739.739 1.723 1.146 2.768 1.146s2.029-.407 2.768-1.146L43.83 39.539c.739-.739 1.146-1.722 1.146-2.768s-.407-2.029-1.146-2.769l-.06-.061zM26.093 16.263L39.528 2.828l16.264 16.264-13.435 13.434-16.264-16.263z'/%3E%3Cpath d='M31.75 13.436l6.364-6.364 5.657 5.657-6.364 6.364-5.657-5.657zm7.777 7.777l6.364-6.364 5.656 5.656-6.364 6.364-5.656-5.656z'/%3E%3C/svg%3E");
  background-size: 1em 1em;
}
</style>
