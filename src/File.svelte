<script>
import { sheetMusic } from './stores.js'

let inputFile
const builtinFiles = [
  'lesson1.mxl',
  'lesson2.mxl',
  'lesson3.mxl',
  'lesson4.mxl',
  'lesson5.mxl',
  'lesson6.mxl',
  'lesson7.mxl',
  'lesson8.mxl',
  'lesson9.mxl',
  'lesson10.mxl',
]
let customFiles = []
let select = builtinFiles[0]

export function open() {
  inputFile.click()
}

export function goTo(offset) {
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
  const type = typeof(file)
  if (type === 'string') {
    if (file === 'open') {
      open()
      return
    }
    $sheetMusic = file
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

$: readFile(select)
</script>

<svelte:window on:drop|preventDefault={onDrop} on:dragover|preventDefault/>
<input multiple bind:this={inputFile} on:change={onChange} type="file" accept=".xml,.mxl,.musicxml" class="hidden">
<select bind:value={select} class="form-select w-32 border-gray-400 hover:border-gray-500 focus:border-gray-500 focus:shadow-none">
  <optgroup label="Builtin">
  {#each builtinFiles as file}
    <option value={file}>
      {file.replace(/\.[^/.]+$/, '')}
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
  <optgroup label="Control">
    <option value="open">
      Open Files
    </option>
  </optgroup>
</select>
