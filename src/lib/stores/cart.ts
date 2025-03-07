// src/lib/stores/cart.ts
// New implementation using context API and signals pattern

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

// Create a cart class for better encapsulation and reactivity
class Cart {
  // Private internal cart state
  private _items: CartItem[] = [];
  
  // State trigger for notifications
  private _version = $state(0);
  
  // Getter for items that creates a dependency on version
  get items(): CartItem[] {
    // Creating a dependency on _version ensures reactivity
    this._version;
    // Return a copy to prevent direct mutation
    return [...this._items];
  }
  
  // Method to trigger updates
  private notifyUpdate() {
    // Increment the version to trigger reactive updates
    this._version++;
  }
  
  // Add item to cart
  addItem(item: MenuItem, quantity = 1, customizations?: Customization[]): void {
    if (customizations) {
      // Add as a new item with customizations
      const newItem: CartItem = { ...item, quantity, customizations };
      this._items.push(newItem);
    } else {
      // Check if exact item (without customizations) already exists in cart
      const existingItemIndex = this._items.findIndex(i => 
        i.id === item.id && !i.customizations
      );
      
      if (existingItemIndex !== -1) {
        // Update quantity if item already exists
        const updatedItem = {
          ...this._items[existingItemIndex],
          quantity: this._items[existingItemIndex].quantity + quantity
        };
        
        // Replace the item in the array
        this._items[existingItemIndex] = updatedItem;
      } else {
        // Add new item if it doesn't exist
        const newItem: CartItem = { ...item, quantity };
        this._items.push(newItem);
      }
    }
    
    // Notify of update
    this.notifyUpdate();
  }
  
  // Remove item from cart
  removeItem(itemId: number, index = 0): void {
    // Find all items that match the ID
    const matchingItems = this._items.filter(item => item.id === itemId);
    
    // If there are multiple matching items (different customizations)
    if (matchingItems.length > 1) {
      // Find the specific item to remove by its index
      const itemToRemove = this._items.findIndex((item, idx) => 
        item.id === itemId && idx === index
      );
      
      if (itemToRemove !== -1) {
        // Create a new array without the specific item
        this._items = [
          ...this._items.slice(0, itemToRemove),
          ...this._items.slice(itemToRemove + 1)
        ];
      }
    } else {
      // If there's only one item with this ID, remove it directly
      this._items = this._items.filter(item => item.id !== itemId);
    }
    
    // Notify of update
    this.notifyUpdate();
  }
  
  // Update item quantity
  updateQuantity(itemId: number, quantity: number, index = 0): void {
    // If quantity is zero or negative, remove the item
    if (quantity <= 0) {
      this.removeItem(itemId, index);
      return;
    }
    
    const targetIndex = this._items.findIndex((item, idx) => 
      item.id === itemId && (idx === index || this._items.filter(i => i.id === itemId).length === 1)
    );
    
    if (targetIndex !== -1) {
      // Create a new array with the updated item
      const updatedItems = [...this._items];
      updatedItems[targetIndex] = {...updatedItems[targetIndex], quantity: quantity};
      
      // Replace the entire array
      this._items = updatedItems;
      
      // Notify of update
      this.notifyUpdate();
    }
  }
  
  // Update a specific item (for customizations)
  updateItem(index: number, updatedItem: CartItem): void {
    if (index >= 0 && index < this._items.length) {
      // Create a new array with the updated item
      const updatedItems = [...this._items];
      updatedItems[index] = updatedItem;
      
      // Replace the entire array
      this._items = updatedItems;
      
      // Notify of update
      this.notifyUpdate();
    }
  }
  
  // Calculate total price
  getTotal(): string {
    // Creating a dependency on _version ensures reactivity
    this._version;
    return this._items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  }
  
  // Get cart item count
  getItemCount(): number {
    // Creating a dependency on _version ensures reactivity
    this._version;
    return this._items.reduce((count, item) => count + item.quantity, 0);
  }
  
  // Clear cart
  clear(): void {
    this._items = [];
    this.notifyUpdate();
  }
}

// Create a singleton instance
export const cart = $state(new Cart());

// Re-export functions with simpler names that use the cart instance
export const cartItems = $derived(cart.items);
export const addToCart = cart.addItem.bind(cart);
export const removeFromCart = cart.removeItem.bind(cart);
export const updateQuantity = cart.updateQuantity.bind(cart);
export const getTotal = cart.getTotal.bind(cart);
export const getItemCount = cart.getItemCount.bind(cart);
export const clearCart = cart.clear.bind(cart);

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