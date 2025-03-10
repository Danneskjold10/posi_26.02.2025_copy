// src/lib/fix.ts
// A typed solution that avoids reactivity issues

// Define types for improved type checking
export interface CartItem {
  id: number;
  price: number;
  quantity: number;
  customizations?: any[];
  [key: string]: any; // For additional properties
}

// Type for the update function
type UpdateFunction = () => void;

// Global reference to a function that forces the UI to update
let forceUpdate: UpdateFunction | null = null;

// Set the update function
export function setUpdateFunction(updateFn: UpdateFunction): void {
  forceUpdate = updateFn;
}

// Force a UI update
export function triggerUpdate(): void {
  if (forceUpdate) {
    forceUpdate();
  }
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

// Utility functions for cart manipulation that trigger UI updates
export function incrementItem(cartItems: CartItem[], index: number): void {
  if (index >= 0 && index < cartItems.length) {
    cartItems[index].quantity += 1;
    triggerUpdate();
  }
}

// Decrement item quantity or remove if quantity becomes 0
export function decrementItem(cartItems: CartItem[], index: number): void {
  if (index >= 0 && index < cartItems.length) {
    if (cartItems[index].quantity > 1) {
      cartItems[index].quantity -= 1;
    } else {
      cartItems.splice(index, 1);
    }
    triggerUpdate();
  }
}

// Add item to cart
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
  
  triggerUpdate();
}