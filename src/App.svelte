<script>
import { showKeyboard } from './stores.js'
import Sheet from './Sheet.svelte'
import Keyboard from './Keyboard.svelte'
import Midi from './Midi.svelte'
import File from './File.svelte'
import Notification from './Notification.svelte'
import Shortcut from './Shortcut.svelte'

let sheet
let file
</script>

<File bind:this={file}/>
<div id="sheet" class:pb-16={$showKeyboard}>
  <Sheet bind:this={sheet}/>
</div>
<Keyboard/>
<Midi/>
<Notification/>
<Shortcut {...{file, sheet}}/>
