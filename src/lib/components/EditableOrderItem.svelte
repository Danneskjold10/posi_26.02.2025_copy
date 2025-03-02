<!-- src/lib/components/EditableOrderItem.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { CartItem, Customization } from '../stores/cart';
  
    export let item: CartItem;
    export let index: number;
    
    const dispatch = createEventDispatcher<{
      increase: { id: number, index: number };
      decrease: { id: number, index: number };
      edit: { item: CartItem, index: number };
    }>();
    
    // Helper function to format customizations in a readable way
    function formatCustomizations(customizations?: Customization[]): string {
      if (!customizations || customizations.length === 0) return '';
      
      const customizationText = customizations
        .map(cat => {
          if (cat.selections.length === 0) return '';
          
          // Special handling for sauces with intensity
          if (cat.category === "Sauce") {
            return `${cat.category}: ${cat.selections.map(sel => {
              if ('intensityLabel' in sel) {
                return `${sel.name} (${sel.intensityLabel})`;
              } else {
                return sel.name;
              }
            }).join(', ')}`;
          }
          
          return `${cat.category}: ${cat.selections.map(sel => sel.name).join(', ')}`;
        })
        .filter(text => text !== '')
        .join(' • ');
      
      return customizationText;
    }
    
    // Determines if an item is customizable/editable
    function isEditable(): boolean {
      // If it already has customizations, it's editable
      if (item.customizations && item.customizations.length > 0) {
        return true;
      }
      
      // Check if it's a customizable item based on ID category
      const categoryId = Math.floor(item.id / 100);
      // Burgers (1xx), Chicken (2xx), and Combos (6xx) are customizable
      return categoryId === 1 || categoryId === 2 || categoryId === 6;
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
          on:click={handleEdit}
        >
          Edit customization
        </button>
      {/if}
    </div>
    
    <div class="flex flex-col items-center ml-4">
      <div class="flex items-center space-x-2 border border-gray-300 rounded-lg overflow-hidden">
        <button 
          class="px-2 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
          on:click={handleDecrease}
          aria-label="Decrease quantity"
        >-</button>
        
        <span class="px-2 font-medium">{item.quantity}</span>
        
        <button 
          class="px-2 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
          on:click={handleIncrease}
          aria-label="Increase quantity"
        >+</button>
      </div>
      
      <div class="text-sm font-bold mt-2">
        ${(item.price * item.quantity).toFixed(2)}
      </div>
    </div>
  </div>