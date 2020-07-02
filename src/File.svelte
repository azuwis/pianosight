<script>
import { sheetMusic } from './stores.js'

let inputFile
const builtinFiles = [
  'easy.xml',
  'hard.xml'
]
let customFiles = []
let select = 'easy.xml'

export function open() {
  inputFile.click()
}

function readFile(file) {
  const type = typeof(file)
  if (type === 'string') {
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
  if (!files || files.length === 0) {
    return
  }
  customFiles = files
  select = customFiles[0]
}

function handleChange(event) {
  showCustomFiles(event.target.files)
  return true
}

function handleDrop(event) {
  const dataTransfer = event.dataTransfer
  if (!dataTransfer) {
    return
  }
  showCustomFiles(dataTransfer.files)
}

$: readFile(select)

</script>

<svelte:window on:drop|preventDefault={handleDrop} on:dragover|preventDefault/>
<input multiple bind:this={inputFile} on:change={handleChange} type="file" accept=".xml,.mxl,.musicxml" class="hidden">
<select bind:value={select}>
  <optgroup label="Builtin">
  {#each builtinFiles as file}
    <option value={file}>
      {file}
    </option>
  {/each}
  </optgroup>
  {#if customFiles.length > 0}
  <optgroup label="Custom">
  {#each customFiles as file}
    <option value={file}>
      {file.name}
    </option>
  {/each}
  </optgroup>
  {/if}
</select>
