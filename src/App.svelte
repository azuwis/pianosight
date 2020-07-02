<script>
import Sheet from './Sheet.svelte'
import Keyboard from './Keyboard.svelte'
import Midi from './Midi.svelte'
import File from './File.svelte'
import Notification from './Notification.svelte'
import Shortcut from './Shortcut.svelte'

let sheet
let file
let keyboard = true
</script>

<File bind:this={file}/>
<div id="sheet" class:pb-16={keyboard}>
  <Sheet bind:this={sheet}/>
</div>
{#if keyboard}
<Keyboard/>
{/if}
<Midi/>
<Notification/>
<Shortcut {...{file, sheet}}/>
