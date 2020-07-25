<script>
import { slide } from 'svelte/transition'
import { debounce } from 'lodash-es'
import {
  sheetNotes,
  showSheetNotes,
  showKeyboard,
  showKeyboardControl,
  keyboardScale,
  stavesToCheck,
  playNotes,
  checkPlayNotes,
} from './stores.js'
import { isTouchScreen } from './utils.js'
import {
  renderKeys,
  totalDimensions,
  defaultOptions,
  getPoints,
  getTextElements
} from 'svg-piano'

let container

$showSheetNotes = !isTouchScreen

$: options = defaultOptions({
  scaleX: $keyboardScale,
  scaleY: $keyboardScale,
  upperHeight: 50,
  palette: ['#39383D', '#F7FAFC'],
  range: ['A0', 'C8']
})

$: dimensions = totalDimensions(options).map(
  v => Math.round(v) + options.strokeWidth * 2
)

$: defaultKeys = renderKeys(options).map(key => ({...key, defaultFill: key.fill}))

$: keys = defaultKeys.map(key => {
  const halfTone = key.index
  let fill = key.defaultFill
  if ($showSheetNotes) {
    let index = 0
    $sheetNotes.forEach((notes, staff) => {
      if ($stavesToCheck.includes(staff) && notes.includes(halfTone)) {
        fill = keyColors[index % keyColors.length]
      }
      index++
    })
  }
  if ($playNotes.has(halfTone)) {
    fill = 'orange'
  }
  return {...key, fill}
})

function makeKeyText(key) {
  const text = getTextElements(key).text
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

$: textC = makeKeyText(defaultKeys[39])
$: textPrevious = makeKeyText(defaultKeys[44])
$: textUp = makeKeyText(defaultKeys[46])
$: textNext = makeKeyText(defaultKeys[48])

function keyOn(key) {
  $playNotes.add(key.index)
  checkPlayNotes()
  $playNotes = $playNotes
}

function keyOff(key) {
  $playNotes.delete(key.index)
  $playNotes = $playNotes
}

let onMousedown = () => {}
let onMouseup = () => {}
let onTouchstart = () => {}
let onTouchend = () => {}

if (isTouchScreen) {
  onTouchstart = keyOn
  onTouchend = keyOff
} else {
  onMousedown = keyOn
  onMouseup = keyOff
}

// blue-700 red-700 purple-700 pink-700
const keyColors = ['#2B6CB0', '#C53030', '#6B46C1', '#B83280']

function scrollToCenter(element) {
  if (element) {
    element.scrollTo((dimensions[0] - element.clientWidth) / 2, 0)
  }
}

$: if($keyboardScale) {
  scrollToCenter(container)
}

const scrollToCenterDebounced = debounce(scrollToCenter, 200)
</script>

<svelte:window on:resize={() => scrollToCenterDebounced(container)}/>
{#if $showKeyboard}
<div transition:slide>
<div bind:this={container} use:scrollToCenter class="keyboard flex flex-col overflow-x-auto">
  <svg width={dimensions[0]} height={dimensions[1]} class="m-auto">
    {#each keys as key, index (key.index)}
    <polygon
      on:mousedown={() => onMousedown(key)}
      on:mouseup={() => onMouseup(key)}
      on:touchstart={() => onTouchstart(key)}
      on:touchend={() => onTouchend(key)}
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
</div>
{/if}

<style>
.keyboard {
  margin-bottom: -1px;
}
</style>
