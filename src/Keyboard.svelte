<script>
import {
  sheetNotes,
  showSheetNotes,
  showKeyboard,
  showKeyboardControl,
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
  scaleX: 1.2,
  scaleY: 1.2,
  upperHeight: 50,
  range: ['A0', 'C8']
})

let keys = renderKeys(options).map(key => ({...key, defaultFill: key.fill}))

$showSheetNotes = !mobile

const dimensions = totalDimensions(options).map(
  v => Math.round(v) + options.strokeWidth * 2
)

function makeKeyText(index) {
  const text = getTextElements(keys[index]).text
  return {
    x: text.x,
    y: text.y,
    'text-anchor': text.textAnchor,
    'font-size': text.fontSize * 3,
    'font-family': text.fontFamily,
    fill: '#39383D',
    'class': 'pointer-events-none'
  }
}

const textC = makeKeyText(39)
const textPrevious = makeKeyText(44)
const textUp = makeKeyText(46)
const textNext = makeKeyText(48)

function keyOn(key) {
  $playNotes.add(key.index)
  checkPlayNotes()
  $playNotes = $playNotes
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

function scrollToCenter(element) {
  element.scrollTo((dimensions[0] - element.clientWidth) / 2, 0)
}
</script>

<svelte:window on:resize={() => scrollToCenter(container)}/>
{#if $showKeyboard}
<div bind:this={container} use:scrollToCenter class="keyboard fixed bottom-0 w-screen flex flex-col overflow-x-auto">
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
    <text {...textC}>C</text>
    {#if $showKeyboardControl}
    <text {...textPrevious}>⇐</text>
    <text {...textUp}>⇑</text>
    <text {...textNext}>⇒</text>
    {/if}
  </svg>
</div>
{/if}

<style>
.keyboard {
  margin-bottom: -1px;
}
</style>
