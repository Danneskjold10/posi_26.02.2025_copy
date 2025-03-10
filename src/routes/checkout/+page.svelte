<!-- src/routes/checkout/+page.svelte -->
<script lang="ts">
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';
    import { cartItems, formatDiningOption } from "$lib/stores/cart";
    import EditableOrderItem from "$lib/components/EditableOrderItem.svelte";
    import CustomizationModal from "$lib/components/CustomizationModal.svelte";
    import { generateOrderNumber, findOriginalItemPrice, calculateCustomizationCost } from "$lib/utils";
    import { incrementItem, decrementItem, getTotal, getItemCount } from "$lib/dom-fix";
    
    // State variables
    let diningOption = $state<string | null>(null);
    let selectedPayment = $state('');
    let showQrCode = $state(false);
    let orderComplete = $state(false);
    let orderNumber = $state(generateOrderNumber());
    
    // For editing customizations
    let editingItem = $state<any | null>(null);
    let editingItemIndex = $state(-1);
    let showCustomizationModal = $state(false);
    let originalItemBasePrice = $state(0);
    
    // Initialize dining option
    $effect(() => {
      // Only run in the browser
      if (!browser) return;
      
      diningOption = localStorage.getItem('diningOption');
      
      // If no dining option is set, redirect back to selection screen
      if (!diningOption) {
        goto('/');
      }
    });
    
    function selectPaymentMethod(method: string): void {
      selectedPayment = method;
    }
    
    function handlePayment(): void {
      if (selectedPayment === 'qr') {
        showQrCode = true;
      } else {
        completeOrder();
      }
    }
    
    function completeOrder(): void {
      orderComplete = true;
      // In a real app, you would process payment here
      // For demo purposes, just clear cart
      cartItems.length = 0;
      
      // Update DOM elements after cart clear
      setTimeout(() => {
        const totalElements = document.querySelectorAll('[data-cart-total]');
        const countElements = document.querySelectorAll('[data-cart-count]');
        
        totalElements.forEach(el => {
          el.textContent = '$0.00';
        });
        
        countElements.forEach(el => {
          el.textContent = '0';
        });
      }, 0);
    }
    
    function handleNextOrder(): void {
      goto('/');
    }
    
    function handleBack(): void {
      if (orderComplete) {
        orderComplete = false;
        goto('/menu');
      } else if (showQrCode) {
        showQrCode = false;
      } else {
        goto('/menu');
      }
    }
    
    // Handle edit request from order item
    function handleEdit(item: any, index: number): void {
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
        cartItems[editingItemIndex] = {
          ...customizedItem,
          price: finalPrice,
          quantity: cartItems[editingItemIndex].quantity,
          customizations
        };
        
        // Update DOM elements manually
        setTimeout(() => {
          const totalElements = document.querySelectorAll('[data-cart-total]');
          totalElements.forEach(el => {
            el.textContent = `$${getTotal(cartItems)}`;
          });
          
          const subtotalElement = document.querySelector(`[data-item-subtotal="${editingItemIndex}"]`);
          if (subtotalElement) {
            subtotalElement.textContent = `$${(finalPrice * cartItems[editingItemIndex].quantity).toFixed(2)}`;
          }
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
  </script>
  
  <div class="flex flex-col min-h-screen bg-orange-50">
    <!-- Header with back button and logo -->
    <div class="flex justify-between items-center p-4">
      <button class="text-orange-500 flex items-center" onclick={handleBack}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Back
      </button>
      
      <img src="/icons/burger logo1.svg" alt="Burger Express" class="h-48 w-48" />
      
      <div class="text-orange-500">
        EN ▼
      </div>
    </div>
  
    {#if !showQrCode && !orderComplete}
      <!-- Payment Selection Screen -->
      <div class="flex flex-col items-center px-4 py-8">
        <h1 class="text-2xl font-bold text-center mb-10">Please select a<br>payment type?</h1>
        
        <div class="grid grid-cols-3 gap-4 w-full max-w-md mb-10">
          <button 
            class="flex flex-col items-center p-4 rounded-xl {selectedPayment === 'qr' ? 'bg-orange-500 text-white' : 'bg-orange-100'}"
            onclick={() => selectPaymentMethod('qr')}
          >
            <div class="mb-2 flex items-center justify-center h-12">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3z" />
                <rect x="13" y="13" width="3" height="3" />
                <rect x="16" y="16" width="3" height="3" />
                <rect x="19" y="13" width="2" height="3" />
                <rect x="16" y="19" width="3" height="2" />
              </svg>
            </div>
            <span class="text-sm font-medium">QR Pay</span>
          </button>
          
          <button 
            class="flex flex-col items-center p-4 rounded-xl {selectedPayment === 'card' ? 'bg-orange-500 text-white' : 'bg-orange-100'}"
            onclick={() => selectPaymentMethod('card')}
          >
            <div class="mb-2 flex items-center justify-center h-12">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <span class="text-sm font-medium">Credit Card</span>
          </button>
          
          <button 
            class="flex flex-col items-center p-4 rounded-xl {selectedPayment === 'cash' ? 'bg-orange-500 text-white' : 'bg-orange-100'}"
            onclick={() => selectPaymentMethod('cash')}
          >
            <div class="mb-2 flex items-center justify-center h-12">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8M9 12h6" />
              </svg>
            </div>
            <span class="text-sm font-medium">Cash</span>
            <span class="text-xs">(Pay at counter)</span>
          </button>
        </div>
        
        <!-- Payment Method and Order Summary -->
        <div class="w-full max-w-md">
          <div class="mb-3">
            <p class="font-medium">Payment Method:</p>
            <p class="font-bold">{selectedPayment === 'qr' ? 'QR Pay' : selectedPayment === 'card' ? 'Credit Card' : selectedPayment === 'cash' ? 'Cash' : 'Not selected'}</p>
          </div>
          
          <!-- Order Items with the updated component -->
          <div class="bg-white rounded-xl p-4 mb-6 shadow">
            <h2 class="text-lg font-bold mb-4">Order Summary</h2>
            
            <div class="max-h-64 overflow-y-auto mb-4">
              {#each cartItems as item, i (i)}
                <EditableOrderItem 
                  item={item} 
                  index={i}
                  on:increase={() => incrementItem(cartItems, i)}
                  on:decrease={() => decrementItem(cartItems, i)}
                  on:edit={() => handleEdit(item, i)}
                />
              {/each}
            </div>
            
            <div class="flex justify-between items-center pt-3 border-t border-gray-200">
              <span class="font-bold text-lg">Total Price:</span>
              <span class="font-bold text-lg" data-cart-total>$ {getTotal(cartItems)}</span>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex justify-between">
            <button class="px-6 py-3 bg-orange-100 text-orange-500 rounded-full font-medium" onclick={() => goto('/menu')}>
              Continue Shopping
            </button>
            
            <button 
              class="px-8 py-3 bg-orange-500 text-white rounded-full font-medium {!selectedPayment || cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}"
              onclick={handlePayment}
              disabled={!selectedPayment || cartItems.length === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    {:else if showQrCode && !orderComplete}
      <!-- QR Code Screen -->
      <div class="flex flex-col items-center px-4 py-8">
        <h1 class="text-2xl font-bold text-center mb-10">Read your QR<br>code, please.</h1>
        
        <div class="relative mb-10">
          <div class="w-64 h-64 relative mx-auto">
            <!-- QR Code corners -->
            <div class="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-orange-500"></div>
            <div class="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-orange-500"></div>
            <div class="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-orange-500"></div>
            <div class="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-orange-500"></div>
            
            <!-- QR Code Image (Replace with actual QR code) -->
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BurgerExpress-Order-{Date.now()}" 
              alt="Payment QR Code" 
              class="w-full h-full object-contain p-4"
            />
          </div>
        </div>
        
        <!-- Simulated payment complete button (in a real app this would be automatic) -->
        <button
          class="mt-4 px-8 py-3 bg-orange-500 text-white rounded-full font-medium"
          onclick={completeOrder}
        >
          Simulate Payment Complete
        </button>
      </div>
    {:else}
      <!-- Order Success Screen -->
      <div class="flex flex-col items-center px-4 py-8">
        <div class="w-20 h-20 rounded-full border-2 border-orange-500 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </div>
        
        <h1 class="text-2xl font-bold text-center mb-2">Order Successful!</h1>
        <p class="text-center mb-2">You can pick up your order from the cash register.</p>
        <p class="text-center mb-8 font-medium">{formatDiningOption(diningOption)}</p>
        
        <div class="bg-orange-100 rounded-xl p-6 mb-6 w-full max-w-xs">
          <p class="text-center mb-1">Your order number</p>
          <p class="text-center text-4xl font-bold text-orange-500">{orderNumber}</p>
        </div>
        
        <!-- Like icon -->
        <div class="mb-12">
          <img src="/icons/like1.svg" alt="Like" class="h-32 w-32" />
        </div>
        
        <button
          class="px-8 py-3 bg-orange-100 text-orange-500 rounded-full font-medium"
          onclick={handleNextOrder}
        >
          Next Order
        </button>
      </div>
    {/if}
    
    <!-- Customization Modal for editing - only one instance -->
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