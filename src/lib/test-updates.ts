// src/lib/test-updates.ts
// Add this to test if direct DOM manipulation is working

/**
 * Tests direct DOM updates by directly modifying cart elements
 * This can be called from the browser console to check if DOM updates are possible
 */
export function testDOMUpdates(): void {
    // Find elements with the data attributes
    const totalElements = document.querySelectorAll('[data-cart-total]');
    const countElements = document.querySelectorAll('[data-cart-count]');
    
    console.log('Found total elements:', totalElements.length);
    console.log('Found count elements:', countElements.length);
    
    // Update them with test values
    totalElements.forEach(el => {
      const originalText = el.textContent;
      el.textContent = '$9999.99';
      console.log(`Updated total element from "${originalText}" to "${el.textContent}"`);
    });
    
    countElements.forEach(el => {
      const originalText = el.textContent;
      el.textContent = '9999';
      console.log(`Updated count element from "${originalText}" to "${el.textContent}"`);
    });
    
    // Look for quantity elements
    const quantityElements = document.querySelectorAll('[data-item-quantity]');
    console.log('Found quantity elements:', quantityElements.length);
    
    quantityElements.forEach((el, i) => {
      const originalText = el.textContent;
      el.textContent = '99';
      console.log(`Updated quantity element ${i} from "${originalText}" to "${el.textContent}"`);
    });
  }
  
  // Add a globally accessible function for testing from the console
  if (typeof window !== 'undefined') {
    (window as any).testDOMUpdates = testDOMUpdates;
  }