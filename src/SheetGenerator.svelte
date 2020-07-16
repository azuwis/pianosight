<script>
import {
  EngravingRules,
  Fraction,
  RhythmInstruction,
  RhythmSymbolEnum,
} from 'opensheetmusicdisplay'
import {
  DurationSettings,
  ExampleSourceGenerator,
  PitchSettings,
  ScaleKey,
  XMLSourceExporter,
} from './osme.min.js'
import {
  sheetMusic,
  showSheetGenerator,
} from './stores.js'

let inputScale
let inputTime = 4
let inputMeasure = 16
let inputPitch

const scaleOptions = [
  ['major_0-0', 'C Major'],
  ['major_4-0', 'G Major'],
  ['major_1-0', 'D Major'],
  ['major_5-0', 'A Major'],
  ['major_2-0', 'E Major'],
  ['major_6-0', 'B Major'],
  ['major_3-#', 'F# Major'],
  ['major_3-0', 'F Major'],
  ['major_6-b', 'Bb Major'],
  ['major_2-b', 'Eb Major'],
  ['major_5-b', 'Ab Major'],
  ['major_1-b', 'Db Major'],
  ['major_4-b', 'Gb Major'],
]
const timeOptions = [2, 3, 4]
const measureOptions = [8, 16, 32, 48, 64, 100, 200, 300]

export function generate() {
  const time_signature = new RhythmInstruction(new Fraction(inputTime, 4, 0, false), RhythmSymbolEnum.NONE)
  const scale_key = ScaleKey.fromStringCode(inputScale)
  const pitch_settings = PitchSettings.ALL().get('MINIMAL')
  const duration_settings = DurationSettings.ALL().get('MINIMAL')
  const rules = new EngravingRules()
  const options = {
    time_signature,
    measure_count: inputMeasure,
    scale_key,
    pitch_settings,
    duration_settings,
    rules,
  }
  const generator = new ExampleSourceGenerator(options)
  const exporter = new XMLSourceExporter()
  const xml = exporter.export(generator.generate())
  $sheetMusic = xml
}
</script>

<div class:hidden={!$showSheetGenerator} class="ml-1">
  <div class="flex flex-wrap items-center justify-center -ml-1">
    <div class="w-auto mt-1 ml-1">
      <select bind:value={inputScale} class="form-select" title="Key signature">
        {#each scaleOptions as scale}
        <option value={scale[0]}>
          {scale[1]}
        </option>
        {/each}
      </select>
    </div>

    <div class="w-auto mt-1 ml-1">
      <select bind:value={inputTime} class="form-select" title="Time signature">
        {#each timeOptions as time}
        <option value={time}>
          {time}/4 Time
        </option>
        {/each}
      </select>
    </div>

    <div class="w-auto mt-1 ml-1">
      <select bind:value={inputMeasure} class="form-select" title="Number of measures">
        {#each measureOptions as measure}
        <option value={measure}>
          {measure} Measures
        </option>
        {/each}
      </select>
    </div>

    <button on:click={generate} class="form-button" title="Next line">
      <svg viewBox="0 0 20 20">
        <path d="M14.6568542,15.6568542 C13.209139,17.1045695 11.209139,18 9,18 C4.581722,18 1,14.418278 1,10 C1,5.581722 4.581722,2 9,2 C13.418278,2 17,5.581722 17,10 L15,10 C15,6.6862915 12.3137085,4 9,4 C5.6862915,4 3,6.6862915 3,10 C3,13.3137085 5.6862915,16 9,16 C10.6568542,16 12.1568542,15.3284271 13.2426407,14.2426407 L14.6568542,15.6568542 L14.6568542,15.6568542 Z M12,10 L20,10 L16,14 L12,10 L12,10 Z"></path>
      </svg>
    </button>
  </div>
</div>
