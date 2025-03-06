<!-- src/routes/confirmation/+page.svelte -->
<script lang="ts">
  import { browser } from '$app/environment';
  import { formatDiningOption, getDiningInstructions, generateOrderNumber, generateWaitTime } from '$lib/utils';
  
  // State variables
  let diningOption = $state<string | null>(null);
  
  // Generate values when the component is mounted
  const orderNumber = $state(generateOrderNumber());
  const waitTime = $state(generateWaitTime());
  
  // Initialize dining option
  $effect(() => {
      if (browser) {
          diningOption = localStorage.getItem('diningOption');
      }
  });
</script>

<div class="flex flex-col items-center justify-center py-10">
  <div class="bg-success text-success-content p-4 rounded-full mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
  </div>
  
  <h1 class="text-4xl font-bold mb-4">Order Confirmed!</h1>
  
  <div class="text-center mb-8">
      <p class="text-xl mb-2">Thank you for your order</p>
      
      {#if diningOption}
          <div class="badge badge-primary badge-lg my-3">{formatDiningOption(diningOption)}</div>
      {/if}
      
      <p class="text-lg mt-2">Your order number is: <span class="font-bold">{orderNumber}</span></p>
      <p class="text-lg">Estimated wait time: <span class="font-bold">{waitTime} minutes</span></p>
  </div>
  
  <div class="card bg-base-200 w-full max-w-md">
      <div class="card-body">
          <h2 class="card-title">Next Steps</h2>
          <p>{getDiningInstructions(diningOption)}</p>
          <p class="mt-2">You can track your order status on the display screen.</p>
          
          <div class="card-actions justify-center mt-4">
              <a href="/" class="btn btn-primary">Place Another Order</a>
          </div>
      </div>
  </div>
</div>