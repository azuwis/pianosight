<script>
import { onMount } from 'svelte'
import {
  sheetNotes,
  showSheetNotes,
  playNotes,
  checkPlayNotes
} from './stores.js'
import {
  renderKeys,
  totalDimensions,
  defaultOptions,
  getPoints,
  getTextElements
} from 'svg-piano'

let container

const mobile = navigator.userAgent.match(/(Mobile)/)
const options = defaultOptions({
  upperHeight: 60,
  range: ['A0', 'C8']
})

let keys = renderKeys(options).map(key => ({...key, defaultFill: key.fill}))

$showSheetNotes = !mobile

const dimensions = totalDimensions(options).map(
  v => Math.round(v) + options.strokeWidth * 2
)

const text = getTextElements(keys[39]).text
// const text = Object.assign({},
//   ...Object.entries(getTextElements(keys[39]).text).map(([k, v]) =>
//   ({[k.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()]: v})
// ))

function keyOn(key) {
  $playNotes.add(key.index)
  $playNotes = $playNotes
  checkPlayNotes()
}

function keyOff(key) {
  $playNotes.delete(key.index)
  $playNotes = $playNotes
}

let handleMousedown = () => {}
let handleMouseup = () => {}
let handleTouchstart = () => {}
let handleTouchend = () => {}

if (mobile) {
  handleTouchstart = keyOn
  handleTouchend = keyOff
} else {
  handleMousedown = keyOn
  handleMouseup = keyOff
}

$: keys = keys.map(key => {
  const halfTone = key.index
  let fill = key.defaultFill
  if ($showSheetNotes && $sheetNotes.includes(halfTone)) {
    fill = 'purple'
  }
  if ($playNotes.has(halfTone)) {
    fill = 'orange'
  }
  return {...key, fill}
})

function scrollToCenter() {
  container.scrollTo((dimensions[0] - container.clientWidth) / 2, 0)
}

onMount(scrollToCenter)
</script>

<svelte:window on:resize={scrollToCenter}/>
<div bind:this={container} id="keyboard" class="fixed bottom-0 w-screen flex flex-col overflow-x-auto">
  <svg width={dimensions[0]} height={dimensions[1]} class="m-auto">
    {#each keys as key, index (key.index)}
      <polygon
        on:mousedown={() => handleMousedown(key)}
        on:mouseup={() => handleMouseup(key)}
        on:touchstart={() => handleTouchstart(key)}
        on:touchend={() => handleTouchend(key)}
        points={getPoints(key)
          .map(p => p.join(','))
          .join(' ')}
        style={`fill:${key.fill};stroke:${key.stroke};stroke-width:${key.strokeWidth}`}/>
    {/each}
    <text x={text.x} y={text.y} text-anchor={text.textAnchor} font-size={text.fontSize * 3} font-family={text.fontFamily} fill="#39383D">C</text>
    <!-- <text {...text} fill="#39383D">C</text> -->
  </svg>
</div>

<style>
#keyboard {
  margin-bottom: -1px;
}
</style>
