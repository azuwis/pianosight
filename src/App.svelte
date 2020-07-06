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

<div class="flex flex-wrap flex-col md:flex-row items-center justify-center">
  <div class="flex">
    <File bind:this={file}/>
    <Midi/>
  </div>
  <Nav {sheet}/>
</div>
<Sheet {file} bind:this={sheet}/>
<Keyboard/>
<Notification/>
<Shortcut {...{file, sheet}}/>
