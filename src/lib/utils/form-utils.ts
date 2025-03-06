// src/lib/utils/form-utils.ts
// Utility functions for form handling

/**
 * Validates if a text input is not empty
 * @param value The string value to check
 * @returns True if the value is not empty
 */
export function isNotEmpty(value: string): boolean {
    return value.trim().length > 0;
}

/**
 * Validates if an email format is valid
 * @param email Email string to validate
 * @returns True if email format is valid
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates if a phone number format is valid
 * @param phone Phone number string to validate
 * @returns True if phone format is valid
 */
export function isValidPhone(phone: string): boolean {
    // Simple validation for now - can be improved with more specific format
    const phoneRegex = /^\+?[0-9\s\-\(\)]{8,20}$/;
    return phoneRegex.test(phone);
}

/**
 * Format a credit card number with spaces
 * @param cardNumber Credit card number string
 * @returns Formatted card number with spaces
 */
export function formatCreditCard(cardNumber: string): string {
    // Remove any non-digit characters
    const digitsOnly = cardNumber.replace(/\D/g, '');
    // Add spaces after every 4 digits
    const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
}

/**
 * Mask a credit card number, showing only the last 4 digits
 * @param cardNumber Credit card number string
 * @returns Masked card number
 */
export function maskCreditCard(cardNumber: string): string {
    // Remove any spaces or non-digit characters
    const digitsOnly = cardNumber.replace(/\D/g, '');
    
    if (digitsOnly.length <= 4) return digitsOnly;
    
    // Replace all but last 4 digits with asterisks
    const lastFour = digitsOnly.slice(-4);
    const maskedPart = '*'.repeat(digitsOnly.length - 4);
    
    // Format with spaces
    let masked = maskedPart + lastFour;
    masked = masked.replace(/(.{4})/g, '$1 ').trim();
    
    return masked;
}

/**
 * Format a price as a currency string
 * @param price Number value to format
 * @param decimals Number of decimal places (default: 2)
 * @param currency Currency symbol (default: $)
 * @returns Formatted price string
 */
export function formatPrice(price: number, decimals: number = 2, currency: string = '$'): string {
    return `${currency}${price.toFixed(decimals)}`;
}

/**
 * Calculate discount amount
 * @param price Original price
 * @param discountPercent Discount percentage
 * @returns Discounted amount
 */
export function calculateDiscount(price: number, discountPercent: number): number {
    return price * (discountPercent / 100);
}

/**
 * Apply discount to a price
 * @param price Original price
 * @param discountPercent Discount percentage
 * @returns Price after discount
 */
export function applyDiscount(price: number, discountPercent: number): number {
    return price - calculateDiscount(price, discountPercent);
}

/**
 * Formats a date for display
 * @param date Date to format
 * @param format Format string (default: MM/DD/YYYY)
 * @returns Formatted date string
 */
export function formatDate(date: Date, format: string = 'MM/DD/YYYY'): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return format
        .replace('DD', day)
        .replace('MM', month)
        .replace('YYYY', year.toString());
}

/**
 * Handles a form input change event and updates a state value
 * @param setter State setter function
 * @param event Input change event
 */
export function handleInputChange<T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    setter: (value: string) => void,
    event: Event
): void {
    const target = event.target as T;
    setter(target.value);
}