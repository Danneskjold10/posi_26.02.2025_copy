// src/lib/stores/cart.ts
// Using Svelte 5 runes

// Define types
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
  mainItemId?: number;  // Reference to the main item if this is part of a combo
}

// Initialize the cart with state rune
export const cartItems = $state<CartItem[]>([]);

/**
 * Add item to cart
 * @param {MenuItem} item - The item to add
 * @param {number} [quantity=1] - The quantity to add
 * @param {Customization[]} [customizations] - Optional customizations
 */
export function addToCart(item: MenuItem, quantity = 1, customizations?: Customization[]): void {
  if (customizations) {
    // Add as a new item with customizations
    const newItem: CartItem = { ...item, quantity, customizations };
    cartItems.push(newItem);
  } else {
    // Check if exact item (without customizations) already exists in cart
    const existingItemIndex = cartItems.findIndex(i => 
      i.id === item.id && !i.customizations
    );
    
    if (existingItemIndex !== -1) {
      // Update quantity if item already exists - create a new object for reactivity
      const updatedItem = {
        ...cartItems[existingItemIndex],
        quantity: cartItems[existingItemIndex].quantity + quantity
      };
      
      // Replace the item in the array
      cartItems[existingItemIndex] = updatedItem;
    } else {
      // Add new item if it doesn't exist
      const newItem: CartItem = { ...item, quantity };
      cartItems.push(newItem);
    }
  }
}

/**
 * Remove item from cart
 * @param {number} itemId - The ID of the item to remove
 * @param {number} [index=0] - The index if multiple items have same ID
 */
export function removeFromCart(itemId: number, index = 0): void {
  // Find all items that match the ID
  const matchingItems = cartItems.filter(item => item.id === itemId);
  
  // If there are multiple matching items (different customizations)
  if (matchingItems.length > 1) {
    // Find the specific item to remove by its index
    const itemToRemove = cartItems.findIndex((item, idx) => 
      item.id === itemId && idx === index
    );
    
    if (itemToRemove !== -1) {
      // Create a new array without the specific item
      const newCart = [
        ...cartItems.slice(0, itemToRemove),
        ...cartItems.slice(itemToRemove + 1)
      ];
      
      // Update cartItems with the new array
      cartItems.length = 0;
      cartItems.push(...newCart);
    }
  } else {
    // If there's only one item with this ID, remove it directly
    const newCart = cartItems.filter(item => item.id !== itemId);
    cartItems.length = 0;
    cartItems.push(...newCart);
  }
}

/**
 * Update item quantity
 * @param {number} itemId - The ID of the item to update
 * @param {number} quantity - The new quantity
 * @param {number} [index=0] - The index if multiple items have same ID
 */
export function updateQuantity(itemId: number, quantity: number, index = 0): void {
  // If the quantity is 0 or less, remove the item
  if (quantity <= 0) {
    removeFromCart(itemId, index);
    return;
  }
  
  // Find the specific item to update
  let targetIndex = -1;
  
  // If multiple items have the same ID, use the index to find the specific one
  if (cartItems.filter(i => i.id === itemId).length > 1) {
    targetIndex = cartItems.findIndex((item, idx) => 
      item.id === itemId && idx === index
    );
  } else {
    // Otherwise, find the first item with the matching ID
    targetIndex = cartItems.findIndex(item => item.id === itemId);
  }
  
  // Update the item if found
  if (targetIndex !== -1) {
    // Create a new item with the updated quantity
    const updatedItem = {
      ...cartItems[targetIndex],
      quantity
    };
    
    // Replace the item in the array
    cartItems[targetIndex] = updatedItem;
  }
}

/**
 * Calculate total price
 * @returns {string} The total price formatted to 2 decimal places
 */
export function getTotal(): string {
  return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
}

/**
 * Get cart item count
 * @returns {number} Total number of items in cart (counting quantities)
 */
export function getItemCount(): number {
  return cartItems.reduce((count, item) => count + item.quantity, 0);
}

/**
 * Clear cart
 */
export function clearCart(): void {
  cartItems.length = 0;
}

/**
 * Format customizations as readable text
 * @param {Customization[] | undefined} customizations - The customizations to format
 * @returns {string} Formatted customizations text
 */
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

/**
 * Check if an item is customizable based on its ID
 * @param {number} id - The item ID to check
 * @returns {boolean} Whether the item is customizable
 */
export function isCustomizableItem(id: number): boolean {
  // Check first digit of id
  const categoryId = Math.floor(id / 100);
  // Burgers (1xx), Chicken (2xx), and Combos (6xx) are customizable
  return categoryId === 1 || categoryId === 2 || categoryId === 6;
}

/**
 * Check if an item is eligible for combo based on its ID
 * @param {number} id - The item ID to check
 * @returns {boolean} Whether the item is combo-eligible
 */
export function isComboEligible(id: number): boolean {
  const categoryId = Math.floor(id / 100);
  return categoryId === 1 || categoryId === 2; // Burgers and Chicken
}

/**
 * Format a dining option string for display
 * @param {string | null} option - The dining option ('dine-in' or 'to-go')
 * @returns {string} Formatted dining option text
 */
export function formatDiningOption(option: string | null): string {
  if (!option) return '';
  return option === 'dine-in' ? 'Dine In' : 'To Go';
}