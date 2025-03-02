<!-- src/routes/combo-selection/+page.svelte -->
<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { cart, getTotal } from "$lib/stores/cart";
    import type { CartItem, MenuItem } from "$lib/stores/cart";
    import { menuItems } from "$lib/data/menu-items";
    
    let cartItems: CartItem[] = [];
    let diningOption: string | null = null;
    let mainItem: CartItem | null = null;
    
    // Get sides and drinks from menu items
    let sidesOptions: MenuItem[] = [];
    let drinksOptions: MenuItem[] = [];
    
    // Selected items
    let selectedSide: MenuItem | null = null;
    let selectedDrink: MenuItem | null = null;
    
    // Find menu categories for sides and drinks
    function findMenuCategory(categoryId: number): MenuItem[] {
      const category = menuItems.find(cat => cat.id === categoryId);
      return category ? category.items : [];
    }
    
    // Subscribe to cart changes
    cart.subscribe(items => {
      cartItems = items;
      
      // Get the most recently added item (assuming it's the main item)
      if (items.length > 0 && !mainItem) {
        mainItem = items[items.length - 1];
      }
    });
    
    onMount(() => {
      // Check if dining option was selected
      if (browser) {
        diningOption = localStorage.getItem('diningOption');
        
        // If no dining option is set, redirect back to selection screen
        if (!diningOption) {
          goto('/');
        }
        
        // If cart is empty, redirect back to menu
        if (cartItems.length === 0) {
          goto('/menu');
        }
        
        // Get sides and drinks from menu
        sidesOptions = findMenuCategory(3); // Sides category
        drinksOptions = findMenuCategory(4); // Beverages category
      }
    });
    
    function selectSide(side: MenuItem) {
      selectedSide = side;
    }
    
    function selectDrink(drink: MenuItem) {
      selectedDrink = drink;
    }
    
    function skipCombo() {
      // Skip combo selection and go to desserts page
      goto('/dessert-selection');
    }
    
    function proceedWithCombo() {
      // Calculate combo discount (20% off sides and drinks)
      if (selectedSide) {
        const discountedSide = {
          ...selectedSide,
          price: selectedSide.price * 0.8, // 20% discount
          quantity: 1,
          isComboItem: true,
          mainItemId: mainItem?.id // Reference to main item
        };
        
        // Add side to cart
        cart.update(items => [...items, discountedSide]);
      }
      
      if (selectedDrink) {
        const discountedDrink = {
          ...selectedDrink,
          price: selectedDrink.price * 0.8, // 20% discount
          quantity: 1,
          isComboItem: true,
          mainItemId: mainItem?.id // Reference to main item
        };
        
        // Add drink to cart
        cart.update(items => [...items, discountedDrink]);
      }
      
      // Proceed to desserts page
      goto('/dessert-selection');
    }
    
    function formatDiningOption(option: string | null): string {
      if (!option) return '';
      return option === 'dine-in' ? 'Dine In' : 'To Go';
    }
  </script>
  
  <div class="flex flex-col min-h-screen bg-orange-50">
    <!-- Header with logo -->
    <div class="flex justify-between items-center p-4">
      <button class="text-orange-500 flex items-center" on:click={() => goto('/menu')}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Back to Menu
      </button>
      
      <img src="/icons/burger logo1.svg" alt="Burger Express" class="h-48 w-48" />
      
      <div class="px-4 py-2 bg-orange-100 rounded-full">
        <span class="font-medium">{formatDiningOption(diningOption)}</span>
      </div>
    </div>
  
    <div class="container mx-auto px-4 py-8">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold">Make it a Combo?</h1>
        <p class="text-gray-600 mt-1">Add sides and a drink to complete your meal</p>
      </div>
      
      <!-- Main item display -->
      {#if mainItem}
        <div class="bg-white rounded-xl p-4 mb-6 shadow-md">
          <div class="flex items-center">
            <img src={mainItem.image || "/images/placeholder-food.png"} 
                 alt={mainItem.name} 
                 class="w-20 h-20 object-cover rounded-lg mr-4" />
            <div>
              <h2 class="text-xl font-bold">{mainItem.name}</h2>
              <p class="text-gray-600">${mainItem.price.toFixed(2)}</p>
              {#if mainItem.customizations && mainItem.customizations.length > 0}
                <p class="text-sm text-gray-500 mt-1">Customized</p>
              {/if}
            </div>
          </div>
        </div>
      {/if}
      
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Sides selection -->
        <div class="bg-white rounded-xl p-4 shadow-md">
          <h2 class="text-xl font-bold mb-4">Select a Side</h2>
          
          <div class="space-y-3 max-h-64 overflow-y-auto">
            {#each sidesOptions as side}
              <button 
                class="w-full flex items-center p-3 rounded-lg transition-colors hover:bg-orange-50 
                      {selectedSide?.id === side.id ? 'bg-orange-100 border-2 border-orange-500' : 'border border-gray-200'}"
                on:click={() => selectSide(side)}
              >
                <img src={side.image || "/images/placeholder-food.png"} 
                    alt={side.name} 
                    class="w-16 h-16 object-cover rounded-lg mr-3" />
                <div class="flex-1 text-left">
                  <h3 class="font-bold">{side.name}</h3>
                  <p class="text-gray-600">${side.price.toFixed(2)}</p>
                </div>
                {#if selectedSide?.id === side.id}
                  <div class="bg-orange-500 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                {/if}
              </button>
            {/each}
          </div>
        </div>
        
        <!-- Drinks selection -->
        <div class="bg-white rounded-xl p-4 shadow-md">
          <h2 class="text-xl font-bold mb-4">Select a Drink</h2>
          
          <div class="space-y-3 max-h-64 overflow-y-auto">
            {#each drinksOptions as drink}
              <button 
                class="w-full flex items-center p-3 rounded-lg transition-colors hover:bg-orange-50 
                      {selectedDrink?.id === drink.id ? 'bg-orange-100 border-2 border-orange-500' : 'border border-gray-200'}"
                on:click={() => selectDrink(drink)}
              >
                <img src={drink.image || "/images/placeholder-food.png"} 
                    alt={drink.name} 
                    class="w-16 h-16 object-cover rounded-lg mr-3" />
                <div class="flex-1 text-left">
                  <h3 class="font-bold">{drink.name}</h3>
                  <p class="text-gray-600">${drink.price.toFixed(2)}</p>
                </div>
                {#if selectedDrink?.id === drink.id}
                  <div class="bg-orange-500 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                {/if}
              </button>
            {/each}
          </div>
        </div>
      </div>
      
      <!-- Combo Benefits -->
      <div class="bg-orange-100 rounded-xl p-4 my-6">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-orange-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clip-rule="evenodd" />
          </svg>
          <div>
            <h3 class="font-bold text-lg">Combo Deal: 20% OFF</h3>
            <p class="text-gray-700">Save 20% on sides and drinks when you make it a combo!</p>
          </div>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex justify-between mt-8">
        <button 
          class="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium" 
          on:click={skipCombo}
        >
          Skip Combo
        </button>
        
        <button 
          class="px-8 py-3 bg-orange-500 text-white rounded-full font-medium shadow-md"
          on:click={proceedWithCombo}
          disabled={!selectedSide && !selectedDrink}
          class:opacity-50={!selectedSide && !selectedDrink}
        >
          Add to Order & Continue
        </button>
      </div>
    </div>
    
    <!-- Bottom curve decoration -->
    <div class="mt-auto">
      <div class="h-32 bg-orange-500 rounded-t-[50%] w-full"></div>
    </div>
  </div>