<script>
export let sheet
</script>

<div class="flex">
  <button on:click={sheet.goToPreviousMeasure()} title="Previous Measure">
    <svg viewBox="0 0 20 20">
      <polygon points="3.82842712 9 9.89949494 2.92893219 8.48528137 1.51471863 0 10 0.707106781 10.7071068 8.48528137 18.4852814 9.89949494 17.0710678 3.82842712 11 20 11 20 9 3.82842712 9"></polygon>
    </svg>
  </button>
  <button on:click={sheet.goToNextMeasure()} title="Next Measure">
    <svg viewBox="0 0 20 20">
      <polygon points="16.1715729 9 10.1005051 2.92893219 11.5147186 1.51471863 20 10 19.2928932 10.7071068 11.5147186 18.4852814 10.1005051 17.0710678 16.1715729 11 -5.68434189e-14 11 -5.68434189e-14 9"></polygon>
    </svg>
  </button>
  <button on:click={sheet.goToPreviousLine()} title="Previous Line">
    <svg viewBox="0 0 20 20">
      <polygon points="9 3.82842712 2.92893219 9.89949494 1.51471863 8.48528137 10 0 10.7071068 0.707106781 18.4852814 8.48528137 17.0710678 9.89949494 11 3.82842712 11 20 9 20 9 3.82842712"></polygon>
    </svg>
  </button>
  <button on:click={sheet.goToNextLine()} title="Next Line">
    <svg viewBox="0 0 20 20">
      <polygon points="9 16.1715729 2.92893219 10.1005051 1.51471863 11.5147186 10 20 10.7071068 19.2928932 18.4852814 11.5147186 17.0710678 10.1005051 11 16.1715729 11 0 9 0"></polygon>
    </svg>
  </button>
  <button on:click={sheet.goToFirstMeasure()} title="First Measure">
    <svg viewBox="0 0 20 20">
      <polygon points="5.82842712 9 11.89949494 2.92893219 10.48528137 1.51471863 2 10 2.707106781 10.7071068 10.48528137 18.4852814 11.89949494 17.0710678 5.82842712 11 20 11 20 9 5.82842712 9"></polygon>
      <rect height="18" width="2" x="0" y="1"/>
    </svg>
  </button>
  <button on:click={sheet.goToLastMeasure()} title="Last Measure">
    <svg viewBox="0 0 20 20">
      <polygon points="14.1715729 9 8.1005051 2.92893219 9.5147186 1.51471863 18 10 17.2928932 10.7071068 9.5147186 18.4852814 8.1005051 17.0710678 14.1715729 11 -7.68434189e-14 11 -7.68434189e-14 9"></polygon>
      <rect height="18" width="2" x="18" y="1"/>
    </svg>
  </button>
</div>

<style>
button {
  @apply bg-white py-3 px-4 ml-1 mt-1 border border-gray-400 rounded;
  &:hover {
    @apply bg-gray-200;
  }
  &:focus {
    @apply shadow-outline outline-none;
  }
}

button  svg {
  @apply h-4;
}
</style>
