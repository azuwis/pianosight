<script>
import {
  EngravingRules,
  Fraction,
  RhythmInstruction,
  RhythmSymbolEnum,
} from 'opensheetmusicdisplay'
import {
  ComplexityMap,
  ExampleSourceGenerator,
  ScaleKey,
  XMLSourceExporter,
} from './osme.min.js'
import {
  sheetMusic,
  showSheetGenerator,
} from './stores.js'

let inputScale
let inputTime = 4
let inputComplexity = 6
let inputMeasure = 16

const scaleOptions = [
  ['major_0-0', 'C'],
  ['major_4-0', 'G'],
  ['major_1-0', 'D'],
  ['major_5-0', 'A'],
  ['major_2-0', 'E'],
  ['major_6-0', 'B'],
  ['major_3-#', 'F#'],
  ['major_3-0', 'F'],
  ['major_6-b', 'Bb'],
  ['major_2-b', 'Eb'],
  ['major_5-b', 'Ab'],
  ['major_1-b', 'Db'],
  ['major_4-b', 'Gb'],
]
const timeOptions = [2, 3, 4]
const complexityOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const measureOptions = [8, 16, 32, 48, 64, 96]

export function generate() {
  const time_signature = new RhythmInstruction(new Fraction(inputTime, 4, 0, false), RhythmSymbolEnum.NONE)
  const scale_key = ScaleKey.fromStringCode(inputScale)
  const complexity = inputComplexity / 10
  const pitch_settings = ComplexityMap.getPitchSettings(complexity)
  const duration_settings = ComplexityMap.getDurationSettings(complexity)
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

<!-- svelte-ignore a11y-no-onchange -->
<div class:hidden={!$showSheetGenerator} class="ml-1">
  <div class="flex flex-wrap items-center justify-center -ml-1">
    <div class="w-auto mt-1 ml-1">
      <select bind:value={inputScale} on:change={generate} class="form-select form-scale" title="Key signature">
        {#each scaleOptions as scale}
        <option value={scale[0]}>
          {scale[1]}
        </option>
        {/each}
      </select>
    </div>

    <div class="w-auto mt-1 ml-1">
      <select bind:value={inputTime} on:change={generate} class="form-select form-time" title="Time signature">
        {#each timeOptions as time}
        <option value={time}>
          {time}/4
        </option>
        {/each}
      </select>
    </div>

    <div class="w-auto mt-1 ml-1">
      <select bind:value={inputComplexity} on:change={generate} class="form-select form-complexity" title="Complexity">
        {#each complexityOptions as complexity}
        <option value={complexity}>
          {complexity}
        </option>
        {/each}
      </select>
    </div>

    <div class="w-auto mt-1 ml-1">
      <select bind:value={inputMeasure} on:change={generate} class="form-select form-measure" title="Number of measures">
        {#each measureOptions as measure}
        <option value={measure}>
          {measure}
        </option>
        {/each}
      </select>
    </div>

    <button on:click={generate} class="form-button" title="Regenerate">
      <svg viewBox="0 0 20 20">
        <path d="M14.6568542,15.6568542 C13.209139,17.1045695 11.209139,18 9,18 C4.581722,18 1,14.418278 1,10 C1,5.581722 4.581722,2 9,2 C13.418278,2 17,5.581722 17,10 L15,10 C15,6.6862915 12.3137085,4 9,4 C5.6862915,4 3,6.6862915 3,10 C3,13.3137085 5.6862915,16 9,16 C10.6568542,16 12.1568542,15.3284271 13.2426407,14.2426407 L14.6568542,15.6568542 L14.6568542,15.6568542 Z M12,10 L20,10 L16,14 L12,10 L12,10 Z"></path>
      </svg>
    </button>
  </div>
</div>

<style>
.form-scale {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.2' viewBox='0 0 1.899 3.056' fill='%23718096'%3E%3Cpath d='M0 .028A.238.238 0 01.104 0c.036 0 .068.012.1.028L.192.76.616.68h.012C.668.68.7.708.7.748l.028 2.28a.221.221 0 01-.1.028.221.221 0 01-.1-.028l.012-.732-.424.08H.104c-.04 0-.072-.028-.072-.068zM.556 1.08l-.368.068-.012.828.368-.068zM1.663 2.776c0 .04-.032.076-.072.076a.079.079 0 01-.076-.076v-.58l-.332.124v.632c0 .04-.036.076-.076.076s-.072-.036-.072-.076v-.58l-.128.048c-.008.004-.02.004-.028.004a.08.08 0 01-.08-.08v-.24c0-.032.02-.064.052-.076l.184-.064v-.64l-.128.044c-.008.004-.02.004-.028.004a.08.08 0 01-.08-.08v-.24c0-.032.02-.06.052-.072l.184-.068V.28c0-.04.032-.076.072-.076.04 0 .076.036.076.076v.58l.332-.124V.104c0-.04.036-.076.076-.076s.072.036.072.076v.58L1.79.636c.008-.004.02-.004.028-.004a.08.08 0 01.08.08v.24c0 .032-.02.064-.052.076l-.184.064v.64l.128-.044c.008-.004.02-.004.028-.004a.08.08 0 01.08.08v.24c0 .032-.02.06-.052.072l-.184.068v.632zm-.48-1.508v.64l.332-.12v-.64z'/%3E%3C/svg%3E");
  background-size: 1em 1em;
}

.form-time {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.0' viewBox='0 0 20 58' fill='%23718096'%3E%3Cpath d='M10.95 17.17h.604a6.992 6.992 0 013.13.742 7.125 7.125 0 012.433 1.994 2.843 2.843 0 01-.324-.023 2.856 2.856 0 00-.325-.024c-1.052.039-1.869.414-2.451 1.125a3.81 3.81 0 00-.887 2.445c.07 1.261.498 2.16 1.287 2.695.788.536 1.518.797 2.19.783a3 3 0 002.18-.991c.593-.635.902-1.417.927-2.347 0-.911-.304-1.949-.91-3.114-.607-1.165-1.515-2.185-2.724-3.062-1.209-.876-2.718-1.337-4.526-1.382h-.603l-1.716.14c-3.327.604-5.713 2.014-7.157 4.23-1.444 2.216-2.15 4.808-2.116 7.778-.03 2.969.68 5.561 2.133 7.777 1.453 2.216 3.833 3.626 7.14 4.231l1.716.14c.115.001.221.009.319.022.097.014.192.022.284.024 2.06-.083 3.714-.711 4.96-1.886 1.247-1.175 2.149-2.4 2.705-3.678.557-1.278.83-2.112.82-2.504a.526.526 0 00-.198-.4.647.647 0 00-.405-.156.54.54 0 00-.33.11.66.66 0 00-.227.353c-.459 1.935-1.326 3.571-2.602 4.91-1.276 1.337-2.85 2.034-4.723 2.091a2.448 2.448 0 01-.284-.023c-.098-.013-.204-.021-1.177-.185-2.156-.69-2.979-1.674-3.326-3.112-.348-1.439-.499-3.222-.453-5.35v-4.729c-.046-2.128.105-3.911.453-5.35.347-1.438 1.17-2.42 2.468-2.95'/%3E%3C/svg%3E");
  background-size: 1em 2em;
}

.form-complexity {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 20 20' fill='%23718096' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3.333 8L10 12l10-6-10-6L0 6h10v2H3.333zM0 8v8l2-2.222V9.2L0 8zm10 12l-5-3-2-1.2v-6l7 4.2 7-4.2v6L10 20z'/%3E%3C/svg%3E");
  background-size: 1em 1em;
}

.form-measure {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='160 0 40 100' fill='%23718096'%3E%3Cpath d='M0 0h200v4H0zM0 24h200v4H0zM0 48h200v4H0zM0 72h200v4H0zM0 96h200v4H0z'/%3E%3Cpath d='M176 0h4v100h-4zM188 0h12v100h-12z'/%3E%3C/svg%3E");
  background-size: 0.9em 0.9em;
}
</style>
