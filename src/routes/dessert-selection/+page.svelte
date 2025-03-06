<!-- src/routes/dessert-selection/+page.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { cartItems, getTotal } from "$lib/stores/cart";
  import type { MenuItem } from "$lib/stores/cart";
  import { menuItems } from "$lib/data/menu-items";
  import { formatDiningOption } from '$lib/utils';
  
  // State variables
  let diningOption = $state<string | null>(null);
  let selectedDesserts = $state<Set<number>>(new Set());
  let dessertOptions = $state<MenuItem[]>([]);
  
  // Initialize component
  $effect(() => {
      // Only run in the browser
      if (!browser) return;
      
      diningOption = localStorage.getItem('diningOption');
      
      // If no dining option is set, redirect back to selection screen
      if (!diningOption) {
          goto('/');
      }
      
      // If cart is empty, redirect back to menu
      if (cartItems.length === 0) {
          goto('/menu');
      }
      
      // Get desserts from menu
      dessertOptions = findDesserts();
  });
  
  // Find menu categories for desserts
  function findDesserts(): MenuItem[] {
      const category = menuItems.find(cat => cat.id === 5); // Desserts category ID
      return category ? category.items : [];
  }
  
  function toggleDessert(dessertId: number): void {
      // Create a new Set for reactivity
      const newSelectedDesserts = new Set(selectedDesserts);
      
      if (newSelectedDesserts.has(dessertId)) {
          newSelectedDesserts.delete(dessertId);
      } else {
          newSelectedDesserts.add(dessertId);
      }
      
      // Update the state
      selectedDesserts = newSelectedDesserts;
  }
  
  function skipDesserts(): void {
      // Skip desserts and go to order summary
      goto('/order-review');
  }
  
  function addDesserts(): void {
      // Add selected desserts to cart
      if (selectedDesserts.size > 0) {
          const dessertsToAdd = dessertOptions.filter(dessert => selectedDesserts.has(dessert.id));
          
          // Add each dessert to cart
          dessertsToAdd.forEach(dessert => {
              cartItems.push({
                  ...dessert,
                  quantity: 1
              });
          });
      }
      
      // Proceed to order summary
      goto('/order-review');
  }
  
  // Go back to combo selection
  function handleGoBack(): void {
      goto('/combo-selection');
  }
  
  // Create handler functions for toggling desserts
  function createToggleHandler(dessertId: number) {
      return function() {
          toggleDessert(dessertId);
      };
  }
</script>

<div class="flex flex-col min-h-screen bg-orange-50">
  <!-- Header with logo -->
  <div class="flex justify-between items-center p-4">
      <button class="text-orange-500 flex items-center" onclick={handleGoBack}>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Back
      </button>
      
      <img src="/icons/burger logo1.svg" alt="Burger Express" class="h-48 w-48" />
      
      <div class="px-4 py-2 bg-orange-100 rounded-full">
          <span class="font-medium">{formatDiningOption(diningOption)}</span>
      </div>
  </div>

  <div class="container mx-auto px-4 py-8">
      <div class="text-center mb-8">
          <h1 class="text-2xl font-bold">Add a Sweet Treat?</h1>
          <p class="text-gray-600 mt-1">Complete your meal with something sweet</p>
      </div>
      
      <!-- Cart Summary -->
      <div class="bg-white rounded-xl p-4 mb-8 shadow-md">
          <h2 class="font-bold text-lg mb-2">Your Current Order</h2>
          <div class="flex justify-between text-gray-700">
              <span>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
              <span>Subtotal: ${getTotal()}</span>
          </div>
      </div>
      
      <!-- Desserts Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {#each dessertOptions as dessert}
              <button 
                  class="flex flex-col items-center p-4 rounded-xl transition-all duration-200 bg-white
                        {selectedDesserts.has(dessert.id) ? 'ring-2 ring-orange-500 shadow-md' : 'hover:shadow-md'}
                        transform hover:scale-105"
                  onclick={createToggleHandler(dessert.id)}
              >
                  <div class="relative">
                      <img src={dessert.image || "/images/placeholder-food.png"} 
                          alt={dessert.name} 
                          class="w-28 h-28 object-cover rounded-lg mb-3" />
                      
                      {#if selectedDesserts.has(dessert.id)}
                          <div class="absolute top-0 right-0 bg-orange-500 rounded-full p-1 transform translate-x-1 -translate-y-1">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                              </svg>
                          </div>
                      {/if}
                  </div>
                  
                  <h3 class="font-bold text-center">{dessert.name}</h3>
                  <p class="text-orange-600 font-medium">${dessert.price.toFixed(2)}</p>
              </button>
          {/each}
      </div>
      
      <!-- Special Offer -->
      {#if dessertOptions.length > 0}
          <div class="bg-orange-100 rounded-xl p-4 my-8">
              <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-orange-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  <div>
                      <h3 class="font-bold text-lg">Special Offer</h3>
                      <p class="text-gray-700">Add a dessert to any combo for a complete meal experience!</p>
                  </div>
              </div>
          </div>
      {/if}
      
      <!-- Action Buttons -->
      <div class="flex justify-between mt-8">
          <button 
              class="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium" 
              onclick={skipDesserts}
          >
              Skip Dessert
          </button>
          
          <button 
              class="px-8 py-3 bg-orange-500 text-white rounded-full font-medium shadow-md"
              onclick={addDesserts}
              disabled={selectedDesserts.size === 0}
              class:opacity-50={selectedDesserts.size === 0}
          >
              {selectedDesserts.size > 0 ? 'Add to Order & Continue' : 'No Desserts Selected'}
          </button>
      </div>
  </div>
  
  <!-- Bottom curve decoration -->
  <div class="mt-auto">
      <div class="h-32 bg-orange-500 rounded-t-[50%] w-full"></div>
  </div>
</div>