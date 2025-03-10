// src/lib/stores/direct-cart.ts
// A cart implementation that uses direct DOM manipulation for updates

export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
  }
  
  export interface Selection {
    name: string;
    price: number;
    intensityLabel?: string;
  }
  
  export interface Customization {
    category: string;
    selections: Selection[];
  }
  
  export interface CartItem extends MenuItem {
    quantity: number;
    customizations?: Customization[];
    isComboItem?: boolean;
    mainItemId?: number;
  }
  
  // The cart items array
  export let cartItems: CartItem[] = [];
  
  // Add an item to the cart
  export function addToCart(item: MenuItem, quantity = 1, customizations?: Customization[]): void {
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
    
    // Update total display in the DOM
    updateCartTotals();
  }
  
  // Direct DOM update for item quantity
  export function updateItemDirectly(id: number, index: number, newQuantity: number): void {
    // Find the specific cart item
    const item = cartItems[index];
    
    if (item && item.id === id) {
      if (newQuantity <= 0) {
        // Remove the item
        cartItems.splice(index, 1);
        // Force re-render by replacing the entire array
        cartItems = [...cartItems];
      } else {
        // Update the model
        item.quantity = newQuantity;
        
        // Directly update DOM elements
        const quantityElement = document.querySelector(`#item-${index}-quantity`);
        const totalElement = document.querySelector(`#item-${index}-total`);
        
        if (quantityElement) {
          quantityElement.textContent = newQuantity.toString();
        }
        
        if (totalElement) {
          totalElement.textContent = `$${(item.price * newQuantity).toFixed(2)}`;
        }
      }
      
      // Update cart totals
      updateCartTotals();
    }
  }
  
  // Update cart total displays in the DOM
  export function updateCartTotals(): void {
    // Update all cart total elements
    const cartTotalElements = document.querySelectorAll('.cart-total');
    const itemCountElements = document.querySelectorAll('.item-count');
    
    const total = getTotal();
    const count = getItemCount();
    
    cartTotalElements.forEach(element => {
      element.textContent = `$${total}`;
    });
    
    itemCountElements.forEach(element => {
      element.textContent = count.toString();
    });
  }
  
  // Increment item quantity
  export function incrementQuantity(id: number, index: number): void {
    const item = cartItems[index];
    if (item && item.id === id) {
      updateItemDirectly(id, index, item.quantity + 1);
    }
  }
  
  // Decrement item quantity
  export function decrementQuantity(id: number, index: number): void {
    const item = cartItems[index];
    if (item && item.id === id) {
      updateItemDirectly(id, index, item.quantity - 1);
    }
  }
  
  // Remove item from cart
  export function removeFromCart(id: number, index: number): void {
    if (index >= 0 && index < cartItems.length) {
      cartItems.splice(index, 1);
      updateCartTotals();
    }
  }
  
  // Calculate total price
  export function getTotal(): string {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  }
  
  // Get number of items in cart
  export function getItemCount(): number {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }
  
  // Clear cart
  export function clearCart(): void {
    cartItems = [];
    updateCartTotals();
  }
  
  // Format customizations for display
  export function formatCustomizations(customizations?: Customization[]): string {
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
  
  // Check if an item is customizable
  export function isCustomizableItem(id: number): boolean {
    // Check first digit of id
    const categoryId = Math.floor(id / 100);
    // Burgers (1xx), Chicken (2xx), and Combos (6xx) are customizable
    return categoryId === 1 || categoryId === 2 || categoryId === 6;
  }
  
  // Format dining option text
  export function formatDiningOption(option: string | null): string {
    if (!option) return '';
    return option === 'dine-in' ? 'Dine In' : 'To Go';
  }