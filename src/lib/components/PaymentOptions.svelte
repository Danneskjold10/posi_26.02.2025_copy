<!-- src/lib/components/PaymentOptions.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  // State for selected payment method
  let selectedPayment = $state('card');
  
  // Create event dispatcher for payment method selection
  const dispatch = createEventDispatcher<{
      payment: { method: string }
  }>();
  
  // Handler for payment submission
  function handlePaymentSubmit(): void {
      dispatch('payment', { method: selectedPayment });
  }
  
  // Handler for radio button changes
  function setPaymentMethod(method: string): void {
      selectedPayment = method;
  }
</script>

<div class="bg-base-200 p-4 rounded-lg">
  <h2 class="text-xl font-bold mb-4">Payment Method</h2>
  
  <div class="form-control">
      <label class="label cursor-pointer justify-start">
          <input 
              type="radio" 
              name="payment" 
              class="radio radio-primary mr-2" 
              checked={selectedPayment === 'card'}
              onclick={() => setPaymentMethod('card')} 
          />
          <span class="label-text">Credit/Debit Card</span>
      </label>
  </div>
  
  <div class="form-control">
      <label class="label cursor-pointer justify-start">
          <input 
              type="radio" 
              name="payment" 
              class="radio radio-primary mr-2" 
              checked={selectedPayment === 'cash'} 
              onclick={() => setPaymentMethod('cash')}
          />
          <span class="label-text">Cash</span>
      </label>
  </div>
  
  <div class="form-control">
      <label class="label cursor-pointer justify-start">
          <input 
              type="radio" 
              name="payment" 
              class="radio radio-primary mr-2" 
              checked={selectedPayment === 'mobile'} 
              onclick={() => setPaymentMethod('mobile')}
          />
          <span class="label-text">Mobile Payment</span>
      </label>
  </div>
  
  <button class="btn btn-primary w-full mt-4" onclick={handlePaymentSubmit}>
      Continue to Payment
  </button>
</div>