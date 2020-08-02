<script>
import { onMount, onDestroy } from 'svelte'
import { scale } from 'svelte/transition'
import Sheet from './Sheet.svelte'
import SheetGenerator from './SheetGenerator.svelte'
import Keyboard from './Keyboard.svelte'
import Midi from './Midi.svelte'
import File from './File.svelte'
import Staves from './Staves.svelte'
import Notification from './Notification.svelte'
import Shortcut from './Shortcut.svelte'
import Nav from './Nav.svelte'
import { playMatch } from './stores.js'

let sheet
let sheetGenerator
let file

let innerHeight
let toolbar
let toolbarHidden = false

function showToolbar() {
  if (toolbarHidden) {
    toolbar.style.height = `${toolbar.scrollHeight}px`
    toolbarHidden = false
  }
}

function hideToolbar() {
  if (!toolbarHidden) {
    toolbar.style.height = `${toolbar.scrollHeight}px`
    setTimeout(() => {
      toolbar.style.height = 0
    }, 0)
    toolbarHidden = true
  }
}

onMount(() => {
  toolbar.addEventListener('transitionend', () => {
    if (!toolbarHidden) {
      toolbar.style.height = ''
    }
  })
  onDestroy(playMatch.subscribe((pm) => {
    if (pm > 0) {
      if (innerHeight < 600) {
        hideToolbar()
      }
    }
  }))
})
</script>

<svelte:window bind:innerHeight={innerHeight}/>
{#if toolbarHidden}
<div on:click={showToolbar} transition:scale class="fixed right-0 z-50 p-1 mr-2 mt-1 rounded-full text-gray-600 hover:bg-gray-200 active:bg-gray-200" title="Show toolbar">
  <svg viewBox="0 0 20 20" class="h-5 fill-current">
    <path d="M9.293 12.536L5.757 9l1.415-1.414L10 10.414l2.828-2.828L14.243 9 10 13.243l-.707-.707zM20 10c0-5.523-4.477-10-10-10S0 4.477 0 10s4.477 10 10 10 10-4.477 10-10zM10 2a8 8 0 100 16 8 8 0 000-16z" fill-rule="evenodd"/>
  </svg>
</div>
{/if}
<div class="flex flex-col h-screen">
  <div bind:this={toolbar} id="toolbar" class="flex flex-wrap items-center justify-center -ml-1">
    <div class="ml-1">
      <div class="flex flex-wrap items-center justify-center -ml-1">
        <div class="w-32 mt-1 ml-1">
          <File bind:this={file}/>
        </div>
        <div class="w-32 mt-1 ml-1">
          <Midi/>
        </div>
        <div class="mt-1 ml-1">
          <Staves/>
        </div>
      </div>
    </div>
    <SheetGenerator bind:this={sheetGenerator}/>
    <div class="ml-1">
      <Nav {sheet}/>
    </div>
  </div>
  <div class="flex-1 overflow-y-auto lg:px-4">
    <Sheet {file} bind:this={sheet}/>
  </div>
  <Keyboard/>
</div>
<Shortcut {...{file, sheet}}/>
<Notification/>

<style>
#toolbar {
  transition: height .4s;
  overflow-y: hidden;
}
</style>
