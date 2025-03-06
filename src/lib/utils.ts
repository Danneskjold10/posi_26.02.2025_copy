// src/lib/utils.ts
// Utility functions that can be used across components

import type { MenuItem, Customization } from './stores/cart';
import { menuItems } from './data/menu-items';

/**
 * Finds the original base price of an item from menu data
 * @param itemId ID of the item to find
 * @returns The original base price, or 0 if not found
 */
export function findOriginalItemPrice(itemId: number): number {
    for (const category of menuItems) {
        const originalItem = category.items.find(item => item.id === itemId);
        if (originalItem) {
            return originalItem.price;
        }
    }
    return 0; // Default if not found
}

/**
 * Calculate the total cost of customizations
 * @param customizations The customizations to calculate cost for
 * @returns The total cost of all customizations
 */
export function calculateCustomizationCost(customizations?: Customization[]): number {
    if (!customizations) return 0;
    
    let totalCost = 0;
    
    // Sum all costs from selections
    for (const category of customizations) {
        for (const selection of category.selections) {
            totalCost += selection.price || 0;
        }
    }
    
    return totalCost;
}

/**
 * Check if an item is customizable based on its ID
 * @param id Item ID to check
 * @returns True if the item is customizable
 */
export function isCustomizableItem(id: number): boolean {
    // Check first digit of id
    const categoryId = Math.floor(id / 100);
    // Burgers (1xx), Chicken (2xx), and Combos (6xx) are customizable
    return categoryId === 1 || categoryId === 2 || categoryId === 6;
}

/**
 * Check if an item is eligible for combo based on its ID
 * @param id Item ID to check
 * @returns True if the item is combo-eligible
 */
export function isComboEligible(id: number): boolean {
    const categoryId = Math.floor(id / 100);
    return categoryId === 1 || categoryId === 2; // Burgers and Chicken
}

/**
 * Format a dining option string to display format
 * @param option The dining option ('dine-in' or 'to-go')
 * @returns Formatted dining option text
 */
export function formatDiningOption(option: string | null): string {
    if (!option) return '';
    return option === 'dine-in' ? 'Dine In' : 'To Go';
}

/**
 * Get emoji fallback for food options when images fail to load
 * @param option The food option name
 * @returns An emoji representing the food item
 */
export function getEmojiForOption(option: string): string {
    switch (option.toLowerCase()) {
      case 'lettuce': return '🥬';
      case 'tomato': return '🍅';
      case 'onions': return '🧅';
      case 'pickles': return '🥒';
      case 'jalapeños': return '🌶️';
      case 'american': case 'cheddar': case 'swiss': return '🧀';
      case 'ketchup': case 'special sauce': return '🥫';
      case 'mustard': case 'honey mustard': return '🟡';
      case 'mayo': case 'ranch': return '⚪';
      case 'bbq': return '🟤';
      case 'buffalo': return '🔴';
      case 'french fries': return '🍟';
      case 'onion rings': return '⭕';
      case 'side salad': return '🥗';
      case 'cola': case 'diet cola': return '🥤';
      case 'lemon-lime': return '🟢';
      case 'orange': return '🟠';
      case 'water': return '💧';
      default: return '🍔';
    }
}

/**
 * Handle image error event by showing emoji fallback
 * @param event The error event from img element
 */
export function handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
        imgElement.style.display = 'none';
        const nextSibling = imgElement.nextElementSibling as HTMLElement;
        if (nextSibling) {
            nextSibling.style.display = 'block';
        }
    }
}

/**
 * Get intensity label for sauce options
 * @param level The intensity level (-1 to 2)
 * @returns The label text for the intensity
 */
export function getIntensityLabel(level: number): string {
    switch(level) {
        case 0: return 'Light';
        case 1: return 'Regular';
        case 2: return 'Extra';
        default: return 'None';
    }
}

/**
 * Scroll a category element into view with smooth scrolling
 * @param id ID of the element to scroll to
 */
export function scrollCategoryIntoView(id: string): void {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth', 
            inline: 'center', 
            block: 'nearest' 
        });
    }
}

/**
 * Generate a random order number
 * @param min Minimum order number (default: 100)
 * @param max Maximum order number (default: 999)
 * @returns A random order number
 */
export function generateOrderNumber(min: number = 100, max: number = 999): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random wait time estimate
 * @param min Minimum wait time in minutes (default: 5)
 * @param max Maximum wait time in minutes (default: 15)
 * @returns A random wait time
 */
export function generateWaitTime(min: number = 5, max: number = 15): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get instructions based on dining option
 * @param option The dining option ('dine-in' or 'to-go')
 * @returns Instructions text for the customer
 */
export function getDiningInstructions(option: string | null): string {
    if (!option) return '';
    
    if (option === 'dine-in') {
        return 'Please take a table number and find a seat. We will bring your order to your table.';
    } else {
        return 'Please wait at the pickup counter. Your number will be called when your order is ready.';
    }
}