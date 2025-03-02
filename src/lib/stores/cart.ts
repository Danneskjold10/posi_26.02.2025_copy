// src/lib/stores/cart.ts
import { writable } from 'svelte/store';

// Define types
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface Customization {
  category: string;
  selections: {
    name: string;
    price: number;
    intensityLabel?: string;
  }[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  customizations?: Customization[];
  isComboItem?: boolean;
  mainItemId?: number;  // Reference to the main item if this is part of a combo
}

// Initialize the cart store with type
export const cart = writable<CartItem[]>([]);

// Add item to cart
export function addToCart(item: MenuItem, quantity: number = 1, customizations?: Customization[]): void {
  cart.update(items => {
    // For customized items, we'll treat them as unique items
    // This allows customers to have multiple versions of the same item with different customizations
    if (customizations) {
      // Add as a new item with customizations
      return [...items, { ...item, quantity, customizations }];
    } else {
      // Check if exact item (without customizations) already exists in cart
      const existingItemIndex = items.findIndex(i => 
        i.id === item.id && !i.customizations
      );
      
      if (existingItemIndex !== -1) {
        // Update quantity if item already exists
        const updatedItems = [...items];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item if it doesn't exist
        return [...items, { ...item, quantity }];
      }
    }
  });
}

// Remove item from cart
export function removeFromCart(itemId: number, index: number = 0): void {
  cart.update(items => {
    // Find all items that match the ID
    const matchingItems = items.filter(item => item.id === itemId);
    
    // If there are multiple matching items (different customizations),
    // remove only the one at the specified index
    if (matchingItems.length > 1) {
      return items.filter((item, idx) => 
        !(item.id === itemId && idx === index)
      );
    } else {
      // Otherwise, remove all items with the ID
      return items.filter(item => item.id !== itemId);
    }
  });
}

// Update item quantity
export function updateQuantity(itemId: number, quantity: number, index: number = 0): void {
  cart.update(items => {
    // If there are multiple items with the same ID (different customizations),
    // update only the one at the specified index
    return items.map((item, idx) => {
      if (item.id === itemId && (idx === index || items.filter(i => i.id === itemId).length === 1)) {
        return { ...item, quantity };
      }
      return item;
    });
  });
}

// Calculate total price
export function getTotal(items: CartItem[]): string {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
}

// Clear cart
export function clearCart(): void {
  cart.set([]);
}