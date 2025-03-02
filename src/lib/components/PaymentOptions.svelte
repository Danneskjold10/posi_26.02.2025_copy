<!-- src/lib/components/PaymentOptions.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher<{
      payment: { method: string }
    }>();
    
    let selectedPayment: string = 'card';
    
    function handlePaymentSubmit(): void {
      dispatch('payment', { method: selectedPayment });
    }
  </script>
  
  <div class="bg-base-200 p-4 rounded-lg">
    <h2 class="text-xl font-bold mb-4">Payment Method</h2>
    
    <div class="form-control">
      <label class="label cursor-pointer justify-start">
        <input type="radio" name="payment" class="radio radio-primary mr-2" bind:group={selectedPayment} value="card" />
        <span class="label-text">Credit/Debit Card</span>
      </label>
    </div>
    
    <div class="form-control">
      <label class="label cursor-pointer justify-start">
        <input type="radio" name="payment" class="radio radio-primary mr-2" bind:group={selectedPayment} value="cash" />
        <span class="label-text">Cash</span>
      </label>
    </div>
    
    <div class="form-control">
      <label class="label cursor-pointer justify-start">
        <input type="radio" name="payment" class="radio radio-primary mr-2" bind:group={selectedPayment} value="mobile" />
        <span class="label-text">Mobile Payment</span>
      </label>
    </div>
    
    <button class="btn btn-primary w-full mt-4" on:click={handlePaymentSubmit}>
      Continue to Payment
    </button>
  </div>