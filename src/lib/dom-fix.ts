// src/lib/dom-fix.ts
// Updated direct DOM manipulation approach with proper item removal

export interface CartItem {
    id: number;
    price: number;
    quantity: number;
    customizations?: any[];
    [key: string]: any;
  }
  
  // Calculate total price
  export function getTotal(cartItems: CartItem[]): string {
    return cartItems.reduce((total: number, item: CartItem) => 
      total + (item.price * item.quantity), 0).toFixed(2);
  }
  
  // Get total item count
  export function getItemCount(cartItems: CartItem[]): number {
    return cartItems.reduce((count: number, item: CartItem) => 
      count + item.quantity, 0);
  }
  
  // Update DOM elements directly
  function updateDOM(cartItems: CartItem[]): void {
    // Update total price elements
    const totalElements = document.querySelectorAll('[data-cart-total]');
    totalElements.forEach(el => {
      el.textContent = `$${getTotal(cartItems)}`;
    });
    
    // Update item count elements
    const countElements = document.querySelectorAll('[data-cart-count]');
    countElements.forEach(el => {
      el.textContent = getItemCount(cartItems).toString();
    });
    
    // Update individual item elements - if they still exist
    cartItems.forEach((item, index) => {
      const quantityElement = document.querySelector(`[data-item-quantity="${index}"]`);
      const subtotalElement = document.querySelector(`[data-item-subtotal="${index}"]`);
      
      if (quantityElement) {
        quantityElement.textContent = item.quantity.toString();
      }
      
      if (subtotalElement) {
        subtotalElement.textContent = `$${(item.price * item.quantity).toFixed(2)}`;
      }
    });
  }
  
  // Helper to force UI refresh after removing items
  function forceUIRefresh(): void {
    // Give time for Svelte to update before forcing refresh
    setTimeout(() => {
      // First, refresh all totals
      const totalElements = document.querySelectorAll('[data-cart-total]');
      const countElements = document.querySelectorAll('[data-cart-count]');
      
      totalElements.forEach(el => {
        el.textContent = `$${getTotal([])}`;
      });
      
      countElements.forEach(el => {
        el.textContent = '0';
      });
      
      // Then, create a small UI update to force Svelte to refresh
      const tempEl = document.createElement('div');
      tempEl.style.display = 'none';
      document.body.appendChild(tempEl);
      document.body.removeChild(tempEl);
      
      // Force a layout recalculation
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const event = new Event('resize');
          window.dispatchEvent(event);
        });
      });
    }, 50);
  }
  
  // Increment item quantity with direct DOM updates
  export function incrementItem(cartItems: CartItem[], index: number): void {
    if (index >= 0 && index < cartItems.length) {
      cartItems[index].quantity += 1;
      updateDOM(cartItems);
    }
  }
  
  // Decrement item quantity with direct DOM updates
  export function decrementItem(cartItems: CartItem[], index: number): void {
    if (index >= 0 && index < cartItems.length) {
      if (cartItems[index].quantity > 1) {
        cartItems[index].quantity -= 1;
        updateDOM(cartItems);
      } else {
        // Remove the item and rebuild the cart
        cartItems.splice(index, 1);
        
        // Force DOM update after removal 
        updateDOM(cartItems);
        
        // If we're on the order review panel, force UI refresh
        if (document.querySelector('.order-panel')) {
          forceUIRefresh();
          
          // Force panel to close if empty
          if (cartItems.length === 0) {
            const orderPanel = document.querySelector('.order-panel');
            if (orderPanel) {
              orderPanel.classList.add('hidden');
            }
          }
        }
      }
    }
  }
  
  // Add item to cart with direct DOM updates
  export function addItem(
    cartItems: CartItem[], 
    item: { id: number; price: number; [key: string]: any }, 
    quantity: number = 1, 
    customizations?: any[]
  ): void {
    if (customizations) {
      // Add as a new item with customizations
      cartItems.push({ 
        ...item, 
        quantity, 
        customizations 
      });
    } else {
      // Check if item already exists without customizations
      const existingItemIndex = cartItems.findIndex(i => 
        i.id === item.id && !i.customizations
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        // Add as new item
        cartItems.push({ ...item, quantity });
      }
    }
    
    updateDOM(cartItems);
  }