<script>
import { notification } from './stores.js'
</script>

<div class:hidden={!$notification} class="fixed inset-0 flex items-center justify-center pointer-events-none">
  <div class="px-3 py-1 bg-gray-600 text-white text-2xl rounded-lg shadow-md">
    {$notification}
  </div>
</div>
