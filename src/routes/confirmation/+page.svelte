<!-- src/routes/confirmation/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    
    // Generate a random order number
    const orderNumber = Math.floor(10000 + Math.random() * 90000);
    
    // Estimate wait time (5-15 minutes)
    const waitTime = Math.floor(5 + Math.random() * 10);
    
    let diningOption: string | null = null;
    
    onMount(() => {
      if (browser) {
        diningOption = localStorage.getItem('diningOption');
      }
    });
    
    function formatDiningOption(option: string | null): string {
      if (!option) return '';
      return option === 'dine-in' ? 'Dine In' : 'To Go';
    }
    
    function getInstructions(option: string | null): string {
      if (!option) return '';
      
      if (option === 'dine-in') {
        return 'Please take a table number and find a seat. We will bring your order to your table.';
      } else {
        return 'Please wait at the pickup counter. Your number will be called when your order is ready.';
      }
    }
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
        <p>{getInstructions(diningOption)}</p>
        <p class="mt-2">You can track your order status on the display screen.</p>
        
        <div class="card-actions justify-center mt-4">
          <a href="/" class="btn btn-primary">Place Another Order</a>
        </div>
      </div>
    </div>
  </div>