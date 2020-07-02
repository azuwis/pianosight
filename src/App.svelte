<script>
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
<Sheet bind:this={sheet}/>
<Keyboard/>
<Midi/>
<Notification/>
<Shortcut {...{file, sheet}}/>
