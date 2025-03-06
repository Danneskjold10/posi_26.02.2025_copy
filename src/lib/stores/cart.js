// src/lib/stores/cart.js
// Without using Svelte 5 runes

// Define types
/**
 * @typedef {Object} MenuItem
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {string} image
 */

/**
 * @typedef {Object} Selection
 * @property {string} name
 * @property {number} price
 * @property {string} [intensityLabel]
 */

/**
 * @typedef {Object} Customization
 * @property {string} category
 * @property {Selection[]} selections
 */

/**
 * @typedef {MenuItem & {
*   quantity: number,
*   customizations?: Customization[],
*   isComboItem?: boolean,
*   mainItemId?: number
* }} CartItem
*/

// Initialize the cart store with type
/** @type {CartItem[]} */
let cartItems = [];

/**
* Add item to cart
* @param {MenuItem} item - The item to add
* @param {number} [quantity=1] - The quantity to add
* @param {Customization[]} [customizations] - Optional customizations
*/
export function addToCart(item, quantity = 1, customizations) {
   if (customizations) {
       // Add as a new item with customizations
       cartItems.push({ ...item, quantity, customizations });
   } else {
       // Check if exact item (without customizations) already exists in cart
       const existingItemIndex = cartItems.findIndex(i => 
           i.id === item.id && !i.customizations
       );
       
       if (existingItemIndex !== -1) {
           // Update quantity if item already exists
           cartItems[existingItemIndex].quantity += quantity;
       } else {
           // Add new item if it doesn't exist
           cartItems.push({ ...item, quantity });
       }
   }
}

/**
* Remove item from cart
* @param {number} itemId - The ID of the item to remove
* @param {number} [index=0] - The index if multiple items have same ID
*/
export function removeFromCart(itemId, index = 0) {
   // Find all items that match the ID
   const matchingItems = cartItems.filter(item => item.id === itemId);
   
   // If there are multiple matching items (different customizations),
   // remove only the one at the specified index
   if (matchingItems.length > 1) {
       cartItems = cartItems.filter((item, idx) => 
           !(item.id === itemId && idx === index)
       );
   } else {
       // Otherwise, remove all items with the ID
       cartItems = cartItems.filter(item => item.id !== itemId);
   }
}

/**
* Update item quantity
* @param {number} itemId - The ID of the item to update
* @param {number} quantity - The new quantity
* @param {number} [index=0] - The index if multiple items have same ID
*/
export function updateQuantity(itemId, quantity, index = 0) {
   // If there are multiple items with the same ID (different customizations),
   // update only the one at the specified index
   cartItems = cartItems.map((item, idx) => {
       if (item.id === itemId && (idx === index || cartItems.filter(i => i.id === itemId).length === 1)) {
           return { ...item, quantity };
       }
       return item;
   });
}

/**
* Calculate total price
* @param {CartItem[]} [items=cartItems] - The cart items to calculate total for
* @returns {string} The total price formatted to 2 decimal places
*/
export function getTotal(items = cartItems) {
   return items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
}

/**
* Get cart item count
* @returns {number} Total number of items in cart (counting quantities)
*/
export function getItemCount() {
   return cartItems.reduce((count, item) => count + item.quantity, 0);
}

/**
* Clear cart
*/
export function clearCart() {
   cartItems = [];
}

/**
* Format customizations as readable text
* @param {Customization[] | undefined} customizations - The customizations to format
* @returns {string} Formatted customizations text
*/
export function formatCustomizations(customizations) {
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
export function isCustomizableItem(id) {
   // Check first digit of id
   const categoryId = Math.floor(id / 100);
   // Burgers (1xx), Chicken (2xx), and Combos (6xx) are customizable
   return categoryId === 1 || categoryId === 2 || categoryId === 6;
}

/**
* Format a dining option string for display
* @param {string | null} option - The dining option ('dine-in' or 'to-go')
* @returns {string} Formatted dining option text
*/
export function formatDiningOption(option) {
   if (!option) return '';
   return option === 'dine-in' ? 'Dine In' : 'To Go';
}

// Export the cart items
export { cartItems };