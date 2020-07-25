<script>
import { allStaves, stavesToCheck } from "./stores.js";
import { fromPairs } from "lodash-es";

</script>

{#each Array.from($allStaves) as staff}
<label>
  <input type=checkbox bind:group={$stavesToCheck} value={staff}>
  {staff}
</label>
{/each}