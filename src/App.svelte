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
  <div class="flex flex-wrap items-center justify-center -ml-1">
    <div class="ml-1">
      <div class="flex flex-wrap items-center justify-center -ml-1">
        <div class="w-48 mt-1 ml-1">
          <File bind:this={file}/>
        </div>
        <div class="w-48 mt-1 ml-1">
          <Midi/>
        </div>
      </div>
    </div>
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
