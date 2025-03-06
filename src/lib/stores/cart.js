// src/lib/stores/cart.js
// Using Svelte 5 runes

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
const cartItems = $state([]);

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
       const newItems = cartItems.filter((item, idx) => 
           !(item.id === itemId && idx === index)
       );
       cartItems.length = 0;
       cartItems.push(...newItems);
   } else {
       // Otherwise, remove all items with the ID
       const newItems = cartItems.filter(item => item.id !== itemId);
       cartItems.length = 0;
       cartItems.push(...newItems);
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
   const updatedItems = cartItems.map((item, idx) => {
       if (item.id === itemId && (idx === index || cartItems.filter(i => i.id === itemId).length === 1)) {
           return { ...item, quantity };
       }
       return item;
   });
   
   cartItems.length = 0;
   cartItems.push(...updatedItems);
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
* Clear cart
*/
export function clearCart() {
   cartItems.length = 0;
}

// Export the cart items as a readable store
export { cartItems };