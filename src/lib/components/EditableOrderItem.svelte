<!-- src/lib/components/EditableOrderItem.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { CartItem } from '../stores/cart';
  // Import formatCustomizations and isCustomizableItem from cart.js
  import { formatCustomizations, isCustomizableItem } from '../stores/cart';

  // Props definition
  let { item, index }: { 
    item: CartItem;
    index: number;
  } = $props();
  
  // Create event dispatcher
  const dispatch = createEventDispatcher<{
    increase: { id: number, index: number };
    decrease: { id: number, index: number };
    edit: { item: CartItem, index: number };
  }>();
  
  // Determines if an item is customizable/editable
  function isEditable(): boolean {
    // If it already has customizations, it's editable
    if (item.customizations && item.customizations.length > 0) {
      return true;
    }
    
    // Check if it's a customizable item based on ID category
    return isCustomizableItem(item.id);
  }
  
  function handleIncrease() {
    dispatch('increase', { id: item.id, index });
  }
  
  function handleDecrease() {
    dispatch('decrease', { id: item.id, index });
  }
  
  function handleEdit() {
    dispatch('edit', { item, index });
  }
</script>

<div class="flex items-center py-4 border-b border-gray-200 last:border-b-0">
<img src={item.image || "/images/placeholder-food.png"} alt={item.name} class="w-16 h-16 object-cover rounded-lg shadow-sm mr-4" />

<div class="flex-grow">
  <h3 class="font-bold">{item.name}</h3>
  <p class="text-sm text-orange-600">${item.price.toFixed(2)} each</p>
  
  <!-- Show customizations if any -->
  {#if item.customizations && item.customizations.length > 0}
    <p class="text-sm mt-1 text-gray-600 line-clamp-2">
      {formatCustomizations(item.customizations)}
    </p>
  {/if}
  
  <!-- Edit button if item is editable -->
  {#if isEditable()}
    <button 
      class="text-blue-600 hover:text-blue-800 text-sm font-semibold mt-1"
      onclick={handleEdit}
    >
      Edit customization
    </button>
  {/if}
</div>

<div class="flex flex-col items-center ml-4">
  <div class="flex items-center space-x-2 border border-gray-300 rounded-lg overflow-hidden">
    <button 
      class="px-2 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
      onclick={handleDecrease}
      aria-label="Decrease quantity"
    >-</button>
    
    <span class="px-2 font-medium">{item.quantity}</span>
    
    <button 
      class="px-2 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
      onclick={handleIncrease}
      aria-label="Increase quantity"
    >+</button>
  </div>
  
  <div class="text-sm font-bold mt-2">
    ${(item.price * item.quantity).toFixed(2)}
  </div>
</div>
</div>