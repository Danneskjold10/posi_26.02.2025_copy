<!-- src/routes/order-review/+page.svelte -->
<script lang="ts">
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';
    import { cartItems, formatDiningOption, formatCustomizations } from "$lib/stores/cart";
    import EditableOrderItem from "$lib/components/EditableOrderItem.svelte";
    import CustomizationModal from "$lib/components/CustomizationModal.svelte";
    import { incrementItem, decrementItem, getTotal, getItemCount } from "$lib/dom-fix";
    import { findOriginalItemPrice, calculateCustomizationCost } from "$lib/utils";
    
    // State variables
    let diningOption = $state<string | null>(null);
    let specialInstructions = $state('');
    
    // For editing customizations
    let editingItem = $state<any | null>(null);
    let editingItemIndex = $state(-1);
    let showCustomizationModal = $state(false);
    let originalItemBasePrice = $state(0);
    
    // Group items for display - we'll keep these definitions but use direct DOM updates
    const mainItems = $derived(cartItems.filter(item => {
        const categoryId = Math.floor(item.id / 100);
        return (categoryId === 1 || categoryId === 2) && !item.isComboItem;
    }));
    
    const sideItems = $derived(cartItems.filter(item => {
        const categoryId = Math.floor(item.id / 100);
        return categoryId === 3 || item.isComboItem;
    }));
    
    const drinkItems = $derived(cartItems.filter(item => {
        const categoryId = Math.floor(item.id / 100);
        return categoryId === 4;
    }));
    
    const dessertItems = $derived(cartItems.filter(item => {
        const categoryId = Math.floor(item.id / 100);
        return categoryId === 5;
    }));
    
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
    });
    
    // Handle edit request from order item
    function handleEdit(item: any, index: number): void {
        // Find the actual index in the main cartItems array
        const cartIndex = cartItems.findIndex(cartItem => 
            cartItem === item || (cartItem.id === item.id && 
            JSON.stringify(cartItem.customizations) === JSON.stringify(item.customizations)));
        
        // Only proceed if we're not already showing the modal and item was found
        if (!showCustomizationModal && cartIndex !== -1) {
            // Store the original base price before editing
            originalItemBasePrice = findOriginalItemPrice(item.id);
            
            // Make a deep copy of the item to edit
            const itemCopy = JSON.parse(JSON.stringify(item));
            
            // If we have the original item, reset the price to base price
            if (originalItemBasePrice > 0) {
                // Set the itemCopy price back to the original catalog price
                itemCopy.price = originalItemBasePrice;
            }
            
            // Now assign to editingItem after all modifications
            editingItem = itemCopy;
            editingItemIndex = cartIndex; // Use the index in the main cartItems array
            showCustomizationModal = true;
        }
    }
  
    // Handle saving customizations
    function handleSaveCustomization(event: CustomEvent): void {
        const { item: customizedItem, customizations } = event.detail;
        
        if (editingItemIndex >= 0 && editingItem !== null) {
            // Calculate the base price and extra costs
            const basePrice = originalItemBasePrice || customizedItem.price;
            const extraCost = calculateCustomizationCost(customizations);
            const finalPrice = basePrice + extraCost;
            
            // Update the cart with customized item
            cartItems[editingItemIndex] = {
                ...customizedItem,
                price: finalPrice,
                quantity: cartItems[editingItemIndex].quantity,
                customizations
            };
            
            // Update DOM elements after card update
            setTimeout(() => {
                const totalElements = document.querySelectorAll('[data-cart-total]');
                totalElements.forEach(el => {
                    el.textContent = `$${getTotal(cartItems)}`;
                });
            }, 0);
        }
        
        // Reset editing state and close modal
        closeModal();
    }
    
    // Handle close modal
    function closeModal(): void {
        editingItem = null;
        editingItemIndex = -1;
        originalItemBasePrice = 0;
        showCustomizationModal = false;
    }
    
    // Functions to handle item increment/decrement in each category
    function handleIncreaseMain(item: any, localIndex: number): void {
        const index = cartItems.indexOf(item);
        if (index !== -1) {
            incrementItem(cartItems, index);
        }
    }
    
    function handleDecreaseMain(item: any, localIndex: number): void {
        const index = cartItems.indexOf(item);
        if (index !== -1) {
            decrementItem(cartItems, index);
        }
    }
    
    function handleIncreaseSide(item: any, localIndex: number): void {
        const index = cartItems.indexOf(item);
        if (index !== -1) {
            incrementItem(cartItems, index);
        }
    }
    
    function handleDecreaseSide(item: any, localIndex: number): void {
        const index = cartItems.indexOf(item);
        if (index !== -1) {
            decrementItem(cartItems, index);
        }
    }
    
    function handleIncreaseDrink(item: any, localIndex: number): void {
        const index = cartItems.indexOf(item);
        if (index !== -1) {
            incrementItem(cartItems, index);
        }
    }
    
    function handleDecreaseDrink(item: any, localIndex: number): void {
        const index = cartItems.indexOf(item);
        if (index !== -1) {
            decrementItem(cartItems, index);
        }
    }
    
    function handleIncreaseDessert(item: any, localIndex: number): void {
        const index = cartItems.indexOf(item);
        if (index !== -1) {
            incrementItem(cartItems, index);
        }
    }
    
    function handleDecreaseDessert(item: any, localIndex: number): void {
        const index = cartItems.indexOf(item);
        if (index !== -1) {
            decrementItem(cartItems, index);
        }
    }
    
    // Add more items to the order
    function addMoreItems(): void {
        goto('/menu');
    }
    
    // Proceed to checkout
    function proceedToCheckout(): void {
        goto('/checkout');
    }
    
    // Go back to dessert selection
    function handleGoBack(): void {
        goto('/dessert-selection');
    }
    
    // Watch for empty cart and redirect if necessary
    $effect(() => {
        if (browser && cartItems.length === 0) {
            goto('/menu');
        }
    });
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
            <h1 class="text-2xl font-bold">Review Your Order</h1>
            <p class="text-gray-600 mt-1">Make any final changes before checkout</p>
        </div>
        
        <!-- Order Summary Sections -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <!-- Main Items Section -->
            {#if mainItems.length > 0}
                <div class="p-4 border-b border-gray-200">
                    <h2 class="text-xl font-bold mb-3 flex items-center">
                        <span class="mr-2">🍔</span> 
                        Main Items
                    </h2>
                    
                    <div class="space-y-4">
                        {#each mainItems as item, i (item.id + '-' + i)}
                            <EditableOrderItem 
                                item={item} 
                                index={cartItems.indexOf(item)}
                                on:increase={() => handleIncreaseMain(item, i)}
                                on:decrease={() => handleDecreaseMain(item, i)}
                                on:edit={() => handleEdit(item, i)}
                            />
                        {/each}
                    </div>
                </div>
            {/if}
            
            <!-- Sides Section -->
            {#if sideItems.length > 0}
                <div class="p-4 border-b border-gray-200 bg-orange-50">
                    <h2 class="text-xl font-bold mb-3 flex items-center">
                        <span class="mr-2">🍟</span> 
                        Sides
                    </h2>
                    
                    <div class="space-y-4">
                        {#each sideItems as item, i (item.id + '-' + i)}
                            <EditableOrderItem 
                                item={item} 
                                index={cartItems.indexOf(item)}
                                on:increase={() => handleIncreaseSide(item, i)}
                                on:decrease={() => handleDecreaseSide(item, i)}
                                on:edit={() => handleEdit(item, i)}
                            />
                        {/each}
                    </div>
                </div>
            {/if}
            
            <!-- Drinks Section -->
            {#if drinkItems.length > 0}
                <div class="p-4 border-b border-gray-200">
                    <h2 class="text-xl font-bold mb-3 flex items-center">
                        <span class="mr-2">🥤</span> 
                        Drinks
                    </h2>
                    
                    <div class="space-y-4">
                        {#each drinkItems as item, i (item.id + '-' + i)}
                            <EditableOrderItem 
                                item={item} 
                                index={cartItems.indexOf(item)}
                                on:increase={() => handleIncreaseDrink(item, i)}
                                on:decrease={() => handleDecreaseDrink(item, i)}
                                on:edit={() => handleEdit(item, i)}
                            />
                        {/each}
                    </div>
                </div>
            {/if}
            
            <!-- Desserts Section -->
            {#if dessertItems.length > 0}
                <div class="p-4 bg-orange-50">
                    <h2 class="text-xl font-bold mb-3 flex items-center">
                        <span class="mr-2">🍦</span> 
                        Desserts
                    </h2>
                    
                    <div class="space-y-4">
                        {#each dessertItems as item, i (item.id + '-' + i)}
                            <EditableOrderItem 
                                item={item} 
                                index={cartItems.indexOf(item)}
                                on:increase={() => handleIncreaseDessert(item, i)}
                                on:decrease={() => handleDecreaseDessert(item, i)}
                                on:edit={() => handleEdit(item, i)}
                            />
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
        
        <!-- Order Total Section -->
        <div class="bg-white rounded-xl p-4 shadow-md mb-8">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-xl font-bold mb-1">Order Total</h2>
                    <p class="text-gray-600">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
                </div>
                <span class="text-2xl font-bold" data-cart-total>${getTotal(cartItems)}</span>
            </div>
            
            <!-- Any combo discounts or offers here -->
            {#if sideItems.length > 0 || drinkItems.length > 0}
                <div class="mt-4 pt-3 border-t border-dashed border-gray-300">
                    <div class="flex items-center text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        <span class="font-medium">Combo discount applied</span>
                    </div>
                </div>
            {/if}
        </div>
        
        <!-- Special Instructions (optional) -->
        <div class="bg-white rounded-xl p-4 shadow-md mb-8">
            <h2 class="text-lg font-bold mb-2">Special Instructions</h2>
            <textarea 
                class="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                placeholder="Any special requests? (e.g., allergies, extra napkins, etc.)"
                bind:value={specialInstructions}
            ></textarea>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex justify-between mt-8">
            <button 
                class="px-6 py-3 bg-orange-100 text-orange-600 rounded-full font-medium" 
                onclick={addMoreItems}
            >
                Add More Items
            </button>
            
            <button 
                class="px-8 py-3 bg-orange-500 text-white rounded-full font-medium shadow-md flex items-center"
                onclick={proceedToCheckout}
                disabled={cartItems.length === 0}
                class:opacity-50={cartItems.length === 0}
            >
                <span>Proceed to Checkout</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
    </div>
    
    <!-- Customization Modal for editing -->
    {#if showCustomizationModal && editingItem}
        <CustomizationModal
            item={editingItem}
            isOpen={showCustomizationModal}
            on:close={closeModal}
            on:addToCart={handleSaveCustomization}
        />
    {/if}
    
    <!-- Bottom curve decoration -->
    <div class="mt-auto">
        <div class="h-32 bg-orange-500 rounded-t-[50%] w-full"></div>
    </div>
  </div>