<!-- src/routes/menu/+page.svelte -->
<script lang="ts">
    import { goto } from '$app/navigation';
    import { menuItems } from "$lib/data/menu-items";
    import MenuCategory from "$lib/components/MenuCategory.svelte";
    import EditableOrderItem from "$lib/components/EditableOrderItem.svelte";
    import { browser } from "$app/environment";
    import { cartItems, getTotal, getItemCount, formatCustomizations } from "$lib/stores/cart";
    import { slide } from 'svelte/transition';
    import CustomizationModal from "$lib/components/CustomizationModal.svelte";
    import { formatDiningOption, findOriginalItemPrice, calculateCustomizationCost, scrollCategoryIntoView } from "$lib/utils";
    
    // State variables
    let isArrowAnimating = $state(false);
    let diningOption = $state<string | null>(null);
    let activeCategory = $state(menuItems[0]?.id || 0);
    let currentSlide = $state(0);
    let isOrderSummaryOpen = $state(false);
    
    // For editing customizations
    let editingItem = $state<any | null>(null);
    let editingItemIndex = $state(-1);
    let showCustomizationModal = $state(false);
    let originalItemBasePrice = $state(0);
    
    // Derived values
    const activeMenuCategory = $derived(menuItems.find(cat => cat.id === activeCategory));
    
    // Promotional slides
    const promoSlides = [
        {
            image: "/images/promo1.jpg",
            title: "Try Our New Deluxe Burger",
            description: "With premium beef and special sauce"
        },
        {
            image: "/images/promo2.jpg",
            title: "Family Combo Deal",
            description: "Save 15% on family orders"
        },
        {
            image: "/images/promo3.jpg",
            title: "Sweet Treats",
            description: "Free dessert with any large combo"
        }
    ];
    
    // Initialize component
    $effect(() => {
        if (browser) {
            diningOption = localStorage.getItem('diningOption');
            
            // If no dining option is set, redirect back to selection screen
            if (!diningOption) {
                goto('/');
            }
            
            // Start the slideshow
            const slideInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % promoSlides.length;
            }, 5000);
            
            // Start arrow animation every 10 seconds
            const arrowInterval = setInterval(animateArrow, 10000);
            
            // Cleanup intervals when component is destroyed
            return () => {
                clearInterval(slideInterval);
                clearInterval(arrowInterval);
            };
        }
    });
    
    // Trigger scrolling when active category changes
    $effect(() => {
        if (activeCategory && browser) {
            setTimeout(() => {
                scrollCategoryIntoView(`category-${activeCategory}`);
            }, 100);
        }
    });
    
    // Functions
    function animateArrow(): void {
        isArrowAnimating = true;
        setTimeout(() => {
            isArrowAnimating = false;
        }, 1000); // Animation duration
    }
    
    function toggleOrderSummary(): void {
        isOrderSummaryOpen = !isOrderSummaryOpen;
    }
    
    function decreaseQuantity(id: number, index: number): void {
        const item = cartItems[index];
        if (item && item.id === id) {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                // Remove the item if quantity is 1
                cartItems.splice(index, 1);
            }
        }
    }
    
    function increaseQuantity(id: number, index: number): void {
        const item = cartItems[index];
        if (item && item.id === id) {
            item.quantity += 1;
        }
    }
    
    function restartOrder(): void {
        // Clear cart
        cartItems.length = 0;
        activeCategory = menuItems[0]?.id || 0;
        isOrderSummaryOpen = false;
    } 
    
    function changeCategory(categoryId: number): void {
        activeCategory = categoryId;
    }
    
    function goToCheckout(): void {
        if (cartItems.length > 0) {
            goto('/checkout');
        }
    }
    
    // Handle edit request from order item
    function handleEditOrderItem(event: CustomEvent): void {
        const { item, index } = event.detail;
        
        // Only proceed if we're not already showing the modal
        if (!showCustomizationModal) {
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
            editingItemIndex = index;
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
            // Create a modified copy of the original item
            const itemToUpdate = {
                ...customizedItem,
                price: finalPrice,
                quantity: cartItems[editingItemIndex].quantity,
            };
            
            // Update the item in the cart array
            cartItems[editingItemIndex] = {
                ...itemToUpdate,
                customizations
            };
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
    
    // Handlers for slides
    function goToSlide(slideIndex: number): void {
        currentSlide = slideIndex;
    }
    
    // Create a handler for category selection
    function createCategoryHandler(categoryId: number): () => void {
        return function() {
            changeCategory(categoryId);
        };
    }
    
    // Create handlers for slides
    function createSlideHandler(slideIndex: number): () => void {
        return function() {
            goToSlide(slideIndex);
        };
    }
    
    // Create handlers for scroll buttons
    function handleScrollLeft(): void {
        const container = document.querySelector('.hide-scrollbar');
        if (container) {
            container.scrollLeft -= 200;
        }
    }
    
    function handleScrollRight(): void {
        const container = document.querySelector('.hide-scrollbar');
        if (container) {
            container.scrollLeft += 200;
        }
    }
    
    // Keyboard event handlers for accessibility
    function handleKeyDown(event: KeyboardEvent, action: () => void): void {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            action();
        }
    }
  </script>
  
  <div class="flex flex-col min-h-screen">
  <!-- Promotional Slideshow -->
  <div class="relative w-full h-64 md:h-80 overflow-hidden mb-6 rounded-xl shadow-lg">
    {#each promoSlides as slide, i}
        <div 
            class="absolute inset-0 w-full h-full transition-opacity duration-1000 bg-cover bg-center"
            style="background-image: url({slide.image}); opacity: {i === currentSlide ? '1' : '0'};"
        >
            <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                <div class="text-white max-w-md p-8">
                    <h2 class="text-3xl md:text-4xl font-bold mb-2">{slide.title}</h2>
                    <p class="text-lg md:text-xl">{slide.description}</p>
                </div>
            </div>
        </div>
    {/each}
    
    <!-- Slide indicators -->
    <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {#each promoSlides as _, i}
            <button 
                class="w-3 h-3 rounded-full transition-colors duration-300 {i === currentSlide ? 'bg-white' : 'bg-white/40'}"
                onclick={createSlideHandler(i)}
                onkeydown={e => handleKeyDown(e, createSlideHandler(i))}
                aria-label="Go to slide {i + 1}"
            ></button>
        {/each}
    </div>
  </div>
  
  <div class="container mx-auto px-4">
    <!-- Header area -->
    <div class="flex flex-col mb-4">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-4xl font-bold">Our Menu</h1>
                {#if diningOption}
                    <div class="badge badge-primary badge-lg mt-2">{formatDiningOption(diningOption)}</div>
                {/if}
            </div>
        </div>
    </div>
    
    <!-- Horizontal Category Navigation - Framed Container -->
    <div class="relative mb-8 mx-auto max-w-4xl">
        <div class="rounded-3xl border border-gray-200 bg-white shadow-md p-2 overflow-hidden">
            <!-- Left scroll button -->
            <button 
                class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-2 shadow-md" 
                onclick={handleScrollLeft}
                onkeydown={e => handleKeyDown(e, handleScrollLeft)}
                aria-label="Scroll left"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
            </button>
            
            <!-- Scrollable category bar -->
            <div class="overflow-x-auto py-3 px-10 hide-scrollbar flex items-center justify-center space-x-6">
                {#each menuItems as category}
                    <button 
                        id="category-{category.id}"
                        class="flex flex-col items-center min-w-20 transition-all duration-300 focus:outline-none {activeCategory === category.id ? 'text-primary font-bold' : ''}"
                        onclick={createCategoryHandler(category.id)}
                        onkeydown={e => handleKeyDown(e, createCategoryHandler(category.id))}
                    >
                        <div class="w-16 h-16 rounded-xl bg-orange-50 flex items-center justify-center mb-2 overflow-hidden {activeCategory === category.id ? 'bg-orange-200' : ''}">
                            {#if category.imageUrl}
                                <img src={category.imageUrl} alt={category.category} class="w-12 h-12 object-contain" />
                            {:else}
                                <span class="text-3xl">{category.icon}</span>
                            {/if}
                        </div>
                        
                        <span class="text-sm text-center leading-tight">{category.category}</span>
                    </button>
                {/each}
            </div>
            
            <!-- Right scroll button -->
            <button 
                class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-2 shadow-md" 
                onclick={handleScrollRight}
                onkeydown={e => handleKeyDown(e, handleScrollRight)}
                aria-label="Scroll right"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 01-1.414-1.414L9.586 10 5.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
    </div>
    
    <!-- Category Content Section -->
    <div class="w-full">
        {#if activeMenuCategory}
            <div class="relative mb-6">
                <h2 class="text-3xl font-bold pb-2 inline-block">
                    <span class="mr-3">{activeMenuCategory.icon}</span>
                    {activeMenuCategory.category}
                    <span class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent rounded-full"></span>
                </h2>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each activeMenuCategory.items as item}
                    <MenuCategory item={item} />
                {/each}
            </div>
        {/if}
    </div>
  </div>
  
  <!-- Order Summary Section -->
  <div class="fixed bottom-0 left-0 right-0 z-20">
    <!-- Collapsible Order Panel with Editable Order Items -->
    {#if isOrderSummaryOpen && cartItems.length > 0}
        <div class="bg-white rounded-t-3xl shadow-lg p-6" transition:slide={{ duration: 300 }}>
            <div class="flex justify-between items-center mb-4">
                <div class="flex flex-col">
                    <h2 class="text-3xl font-bold">My Order</h2>
                    <span class="text-gray-600">{formatDiningOption(diningOption)}</span>
                </div>
                
                <!-- Dining Option Display -->
                <div class="px-4 py-2 bg-orange-100 rounded-full">
                    <span class="font-medium">{formatDiningOption(diningOption)}</span>
                </div>
            </div>
            
            <!-- Order Items - now using EditableOrderItem component -->
            <div class="mb-6 max-h-64 overflow-y-auto">
                {#each cartItems as item, i}
                    <EditableOrderItem 
                        item={item} 
                        index={i}
                        on:increase={({detail}) => increaseQuantity(detail.id, detail.index)}
                        on:decrease={({detail}) => decreaseQuantity(detail.id, detail.index)}
                        on:edit={handleEditOrderItem}
                    />
                {/each}
            </div>
            
            <!-- Checkout Actions -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <button 
                    class="px-6 py-3 bg-orange-100 text-orange-500 rounded-full font-medium" 
                    onclick={restartOrder}
                >
                    Restart Menu
                </button>
                
                <div class="flex items-center">
                    <span class="mr-2 font-bold">Total:</span>
                    <span class="text-xl font-bold">$ {getTotal()}</span>
                </div>
            </div>
        </div>
    {/if}
    
    <!-- Fixed Payment Bar at Bottom -->
    <div class="bg-base-300 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.2)] p-4">
        <div class="container mx-auto flex justify-between items-center">
            <div class="flex-1">
                <div class="flex items-center">
                    <span class="mr-2 font-bold">Items:</span>
                    <span class="badge badge-primary badge-lg">{getItemCount()}</span>
                    <span class="mx-4 font-bold">Total:</span>
                    <span class="text-xl font-bold">${getTotal()}</span>
                </div>
            </div>
            
            <!-- Center Arrow Button -->
            <div class="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                <button 
                    class="bg-white rounded-full p-3 shadow-md z-30"
                    onclick={toggleOrderSummary}
                    onkeydown={e => handleKeyDown(e, toggleOrderSummary)}
                    aria-label="Toggle order summary"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        class="h-6 w-6 transform transition-transform {isOrderSummaryOpen ? 'rotate-180' : ''}" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                    >
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
            
            <button 
                class="relative overflow-hidden group px-8 py-4 h-auto min-h-16 border-4 border-green-800 rounded-full {cartItems.length === 0 ? 'opacity-70 cursor-not-allowed' : 'bg-green-800 text-white hover:bg-green-600'}" 
                onclick={goToCheckout}
                onkeydown={e => handleKeyDown(e, goToCheckout)}
                disabled={cartItems.length === 0}
            >
                <!-- Animated border glow effect -->
                <span class="absolute inset-0 border-4 border-white/20 rounded-full opacity-0 group-hover:opacity-100 scale-105 transition-all duration-300"></span>
                
                <!-- Hover shine effect -->
                <span class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000"></span>
                
                <!-- Button content with increased spacing -->
                <div class="relative z-10 flex items-center justify-center font-bold tracking-wide text-lg">
                    <span>Proceed to Checkout</span>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        class="h-6 w-6 ml-3 transition-transform duration-1000 ease-in-out {isArrowAnimating ? 'translate-x-2' : ''}" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                    >
                        <path 
                            fill-rule="evenodd" 
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                            clip-rule="evenodd" 
                        />
                    </svg>
                </div>
            </button>
        </div>
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
  </div>
  
  <style>
  /* Hide scrollbar but keep functionality */
  .hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  }
  
  .hide-scrollbar::-webkit-scrollbar {
  display: none;  /* Chrome, Safari, Opera */
  }
  </style>