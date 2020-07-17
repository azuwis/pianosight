<script>
import {
  sheetMusic,
  showSheetGenerator,
} from './stores.js'

export let sheetGenerator

let inputFile
const builtinFiles = [
  'goodbye_song.mxl',
]
let customFiles = []
let select = 'generate'

$: if($showSheetGenerator) {
  select = 'generate'
}

export function open() {
  inputFile.click()
}

export function goTo(offset) {
  if (select === 'generate') {
    sheetGenerator.generate()
    return
  }
  let index = builtinFiles.indexOf(select)
  if (index >= 0) {
    select = builtinFiles[(index + offset) % builtinFiles.length]
  } else {
    index = customFiles.indexOf(select)
    if (index >= 0) {
      select = customFiles[(index + offset) % customFiles.length]
    }
  }
}

function readFile(file) {
  let showGenerator = false
  const type = typeof(file)
  if (type === 'string') {
    switch(file) {
      case 'open':
        open()
        break
      case 'generate':
        sheetGenerator.generate()
        showGenerator = true
        break
      default:
        $sheetMusic = file
        break
    }
  } else if (type === 'object') {
    const reader = new FileReader()
    reader.onload = res => {
      $sheetMusic = res.target.result
    }
    const filename = file.name.toLowerCase()
    if (filename.endsWith('.xml') || filename.endsWith('.musicxml')) {
      reader.readAsText(file)
    } else if (filename.endsWith('.mxl')) {
      reader.readAsBinaryString(file)
    }
  }
  $showSheetGenerator = showGenerator
}

function showCustomFiles(files) {
  customFiles = Array.from(files).filter(file => {
    const filename = file.name.toLowerCase()
    return filename.endsWith('.xml') || filename.endsWith('.musicxml')
        || filename.endsWith('.mxl')
  })
  if (customFiles.length) {
    select = customFiles[0]
  }
}

function onChange(event) {
  showCustomFiles(event.target.files)
  return true
}

function onDrop(event) {
  showCustomFiles(event.dataTransfer.files)
}

$: if(sheetGenerator) {
  readFile(select)
}
</script>

<svelte:window on:drop|preventDefault={onDrop} on:dragover|preventDefault/>
<input multiple bind:this={inputFile} on:change={onChange} type="file" accept=".xml,.mxl,.musicxml" class="hidden">
<select bind:value={select} class="form-select" title="Sheet music">
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
  {#if customFiles.length > 0}
  <optgroup label="Custom">
  {#each customFiles as file}
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
