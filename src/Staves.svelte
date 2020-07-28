<script>
import { allStaves, stavesToCheck } from "./stores.js";
import { fromPairs } from "lodash-es";

</script>

<div class="p-2 border border-gray-400 rounded hover:border-gray-500 focus:border-gray-500">
Staff
{#each Array.from($allStaves) as staff}
  <label>
    <input type="checkbox" bind:group={$stavesToCheck} value={staff} class="align-middle">
    {staff}
  </label>
{/each}
</div>