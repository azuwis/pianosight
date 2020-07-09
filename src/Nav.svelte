<script>
import { showSheetNotes, showKeyboard } from './stores.js'

export let sheet
</script>

<div class="flex">
  <button on:click={sheet.goToPreviousMeasure()} title="Previous measure">
    <svg viewBox="0 0 20 20">
      <polygon points="3.82842712 9 9.89949494 2.92893219 8.48528137 1.51471863 0 10 0.707106781 10.7071068 8.48528137 18.4852814 9.89949494 17.0710678 3.82842712 11 20 11 20 9 3.82842712 9"></polygon>
    </svg>
  </button>
  <button on:click={sheet.goToNextMeasure()} title="Next measure">
    <svg viewBox="0 0 20 20">
      <polygon points="16.1715729 9 10.1005051 2.92893219 11.5147186 1.51471863 20 10 19.2928932 10.7071068 11.5147186 18.4852814 10.1005051 17.0710678 16.1715729 11 -5.68434189e-14 11 -5.68434189e-14 9"></polygon>
    </svg>
  </button>
  <button on:click={sheet.goToPreviousLine()} title="Previous line">
    <svg viewBox="0 0 20 20">
      <polygon points="9 3.82842712 2.92893219 9.89949494 1.51471863 8.48528137 10 0 10.7071068 0.707106781 18.4852814 8.48528137 17.0710678 9.89949494 11 3.82842712 11 20 9 20 9 3.82842712"></polygon>
    </svg>
  </button>
  <button on:click={sheet.goToNextLine()} title="Next line">
    <svg viewBox="0 0 20 20">
      <polygon points="9 16.1715729 2.92893219 10.1005051 1.51471863 11.5147186 10 20 10.7071068 19.2928932 18.4852814 11.5147186 17.0710678 10.1005051 11 16.1715729 11 0 9 0"></polygon>
    </svg>
  </button>
  <button on:click={sheet.goToFirstMeasure()} title="First measure">
    <svg viewBox="0 0 20 20">
      <polygon points="5.82842712 9 11.89949494 2.92893219 10.48528137 1.51471863 2 10 2.707106781 10.7071068 10.48528137 18.4852814 11.89949494 17.0710678 5.82842712 11 20 11 20 9 5.82842712 9"></polygon>
      <rect height="18" width="2" x="0" y="1"/>
    </svg>
  </button>
  <button on:click={sheet.goToLastMeasure()} title="Last measure">
    <svg viewBox="0 0 20 20">
      <polygon points="14.1715729 9 8.1005051 2.92893219 9.5147186 1.51471863 18 10 17.2928932 10.7071068 9.5147186 18.4852814 8.1005051 17.0710678 14.1715729 11 -7.68434189e-14 11 -7.68434189e-14 9"></polygon>
      <rect height="18" width="2" x="18" y="1"/>
    </svg>
  </button>
  <button on:click={() => {$showKeyboard = !$showKeyboard}} title="Show/hide keyboard">
    <svg viewBox="0 0 500 500">
      <path d="M382.1,2.8h-39.8h-27.8h-37.8h-53.2h-38.3h-28.4h-38.7H0v494.2h157h28.4h129.2h27.8H500V2.8H382.1z
	 M27.8,469.3V30.7h90.6v250.9h38.7v187.8H27.8V469.3z M185.3,469.3V281.5h38.3V30.7h53.2v250.9h37.8v187.8H185.3V469.3z
	 M472.2,469.3H342.5V281.5h39.7V30.7h90.1V469.3z"></path>
    </svg>
  </button>
  <button on:click={() => {$showSheetNotes = !$showSheetNotes}} title="Show/hide keyboard">
    <svg viewBox="0 0 20 20" fill-rule="evenodd">
      <path d="M11,11.8999819 C13.2822403,11.4367116 15,9.41895791 15,7 C15,4.23857625 12.7614237,2 10,2 C7.23857625,2 5,4.23857625 5,7 C5,9.41895791 6.71775968,11.4367116 9,11.8999819 L9,14 L11,14 L11,11.8999819 Z M13,13.3263688 C15.3649473,12.2029049 17,9.79239596 17,7 C17,3.13400675 13.8659932,0 10,0 C6.13400675,0 3,3.13400675 3,7 C3,9.79239596 4.63505267,12.2029049 7,13.3263688 L7,16 L13,16 L13,13.3263688 Z M7,17 L13,17 L13,18.5 C13,19.3284271 12.3349702,20 11.501424,20 L8.49857602,20 C7.67093534,20 7,19.3342028 7,18.5 L7,17 Z"></path>
    </svg>
  </button>
</div>

<style>
button {
  @apply bg-white p-3 ml-1 mt-1 border border-gray-400 rounded;
  &:hover {
    @apply border-gray-500;
  }
  &:active {
    @apply bg-gray-200;
  }
  &:focus {
    @apply border-gray-500 outline-none;
  }
  -webkit-tap-highlight-color: transparent;
}

button svg {
  @apply h-4;
}
</style>
