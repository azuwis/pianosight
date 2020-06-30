<script>
import { sheetNotes } from './stores.js'
import {
  renderKeys,
  totalDimensions,
  defaultOptions,
  getPoints,
  getTextElements
} from 'svg-piano'

const options = defaultOptions({
  upperHeight: 60,
  range: ['A0', 'C8']
})

let keys = renderKeys(options)
keys = keys.map(key => ({...key, defaultFill: key.fill}))

const dimensions = totalDimensions(options).map(
  v => Math.round(v) + options.strokeWidth * 2
)

const text = getTextElements(keys[39]).text

function handleClick(key, index) {
}

$: keys = keys.map(key =>
    $sheetNotes.includes(key.index + 12) ?
      {...key, fill: 'purple'} :
      {...key, fill: key.defaultFill}
)
</script>

<svg width={dimensions[0]} height={dimensions[1]} style="margin:0">
  {#each keys as key, index}
    <polygon
      on:click={() => handleClick(key, index)}
      points={getPoints(key)
        .map(p => p.join(','))
        .join(' ')}
      style={`fill:${key.fill};stroke:${key.stroke};stroke-width:${key.strokeWidth}`}/>
  {/each}
  <text x={text.x} y={text.y} text-anchor={text.textAnchor} font-size={text.fontSize * 3} font-family={text.fontFamily} fill="#39383D">C</text>
</svg>
