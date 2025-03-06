<!-- src/lib/components/OrderSummary.svelte -->
<script lang="ts">
  import { cartItems, removeFromCart, updateQuantity, getTotal, formatCustomizations } from "../stores/cart";
  
  function handleRemove(id: number, index: number): void {
      removeFromCart(id, index);
  }
  
  function handleQuantityChange(id: number, newQuantity: number, index: number): void {
      if (newQuantity < 1) return;
      updateQuantity(id, newQuantity, index);
  }
  
  function handleDecreaseQuantity(id: number, currentQuantity: number, index: number): void {
      handleQuantityChange(id, currentQuantity - 1, index);
  }
  
  function handleIncreaseQuantity(id: number, currentQuantity: number, index: number): void {
      handleQuantityChange(id, currentQuantity + 1, index);
  }
</script>

<div class="bg-base-200 p-4 rounded-lg">
  <h2 class="text-xl font-bold mb-4">Your Order</h2>
  
  {#if cartItems.length === 0}
      <p class="text-center py-8">Your cart is empty</p>
  {:else}
      <div class="divide-y">
          {#each cartItems as item, index}
              <div class="py-4">
                  <div class="flex justify-between">
                      <div class="flex-1">
                          <h3 class="font-medium">{item.name}</h3>
                          <p class="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                          
                          <!-- Show customizations if any -->
                          {#if item.customizations && item.customizations.length > 0}
                              <p class="text-xs text-gray-600 mt-1">
                                  {formatCustomizations(item.customizations)}
                              </p>
                          {/if}
                      </div>
                      
                      <div class="flex items-center">
                          <button 
                              class="btn btn-xs btn-circle" 
                              onclick={() => handleDecreaseQuantity(item.id, item.quantity, index)} 
                              aria-label="Decrease quantity of {item.name}"
                          >-</button>
                          <span class="mx-2">{item.quantity}</span>
                          <button 
                              class="btn btn-xs btn-circle" 
                              onclick={() => handleIncreaseQuantity(item.id, item.quantity, index)} 
                              aria-label="Increase quantity of {item.name}"
                          >+</button>
                      </div>
                      
                      <div class="ml-4 flex items-center">
                          <span class="mr-2">${(item.price * item.quantity).toFixed(2)}</span>
                          <button 
                              class="btn btn-ghost btn-xs" 
                              onclick={() => handleRemove(item.id, index)} 
                              aria-label="Remove {item.name} from cart"
                          >
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                          </button>
                      </div>
                  </div>
              </div>
          {/each}
      </div>
      
      <div class="mt-4 pt-4 border-t">
          <div class="flex justify-between font-bold">
              <span>Total</span>
              <span>${getTotal()}</span>
          </div>
      </div>
  {/if}
</div>