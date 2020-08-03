<script context="module">
import { get, writable } from 'svelte/store'
import {
  selectedFile,
  sheetMusic,
} from './stores.js'
import { generate } from './SheetGenerator.svelte'

let inputFile
const builtinFiles = [
  'goodbye_song.mxl',
  'ode_to_joy.mxl',
]
const customFiles = writable([])

export function open() {
  inputFile.click()
}

export function goTo(offset) {
  function goToFile(files, file, offset) {
    let index = files.indexOf(file)
    if (index >= 0) {
      let i = (index + offset) % files.length
      if (i < 0) {
        i += files.length
      }
      selectedFile.set(files[i])
      return true
    }
    return false
  }
  const file = get(selectedFile)
  if (file === 'generate') {
    generate()
    return
  }
  if (!goToFile(builtinFiles, file, offset)) {
    goToFile(get(customFiles), file, offset)
  }
}

function readFile(file) {
  const type = typeof(file)
  if (type === 'string') {
    switch(file) {
      case 'open':
        open()
        break
      case 'generate':
        generate()
        break
      default:
        sheetMusic.set(file)
        break
    }
  } else if (type === 'object') {
    const reader = new FileReader()
    reader.onload = res => {
      sheetMusic.set(res.target.result)
    }
    const filename = file.name.toLowerCase()
    if (filename.endsWith('.xml') || filename.endsWith('.musicxml')) {
      reader.readAsText(file)
    } else if (filename.endsWith('.mxl')) {
      reader.readAsBinaryString(file)
    }
  }
}

function showCustomFiles(files) {
  const _customFiles = Array.from(files).filter(file => {
    const filename = file.name.toLowerCase()
    return filename.endsWith('.xml') || filename.endsWith('.musicxml')
        || filename.endsWith('.mxl')
  })
  customFiles.set(_customFiles)
  if (_customFiles.length) {
    selectedFile.set(_customFiles[0])
  }
}

function onChange(event) {
  showCustomFiles(event.target.files)
  return true
}

function onDrop(event) {
  showCustomFiles(event.dataTransfer.files)
}

selectedFile.subscribe( file => {
  readFile(file)
})
</script>

<svelte:window on:drop|preventDefault={onDrop} on:dragover|preventDefault/>
<input multiple bind:this={inputFile} on:change={onChange} type="file" accept=".xml,.mxl,.musicxml" class="hidden">
<select bind:value={$selectedFile} class="form-select" title="Sheet music">
  <optgroup label="Control">
    <option value="generate">
      Generate
    </option>
    <option value="open">
      Open Files
    </option>
  </optgroup>
  <optgroup label="Builtin">
  {#each builtinFiles as file}
    <option value={file}>
      {file.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}
    </option>
  {/each}
  </optgroup>
  {#if $customFiles.length > 0}
  <optgroup label="Custom">
  {#each $customFiles as file}
    <option value={file}>
      {file.name.replace(/\.[^/.]+$/, '')}
    </option>
  {/each}
  </optgroup>
  {/if}
</select>

<style>
.form-select {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' fill='%23718096'%3E%3Cpath d='M18 4.286L8 5.714V17a3 3 0 01-3 3H3a3 3 0 010-6h2c.35 0 .687.06 1 .17V2l14-2v15a3 3 0 01-3 3h-2a3 3 0 010-6h2c.35 0 .687.06 1 .17V4.287z'/%3E%3C/svg%3E");
  background-size: 1em 1em;
}
</style>
