<script>
import Sheet from './Sheet.svelte'
import Keyboard from './Keyboard.svelte'
import Midi from './Midi.svelte'
import File from './File.svelte'
import Notification from './Notification.svelte'
import Shortcut from './Shortcut.svelte'
import Nav from './Nav.svelte'

let sheet
let file
</script>

<div class="flex flex-col h-screen">
  <div class="flex flex-wrap items-center justify-center">
    <div class="flex flex-wrap items-center justify-center space-x-1">
      <div class="w-48 mt-1 ml-1">
        <File bind:this={file}/>
      </div>
      <div class="w-48 mt-1 mr-1">
        <Midi/>
      </div>
    </div>
    <Nav {sheet}/>
  </div>
  <div class="flex-1 overflow-y-auto lg:px-4">
    <Sheet {file} bind:this={sheet}/>
  </div>
  <Keyboard/>
</div>
<Shortcut {...{file, sheet}}/>
<Notification/>
