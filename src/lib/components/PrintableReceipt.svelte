<!-- src/lib/components/PrintableReceipt.svelte -->
<script lang="ts">
    import { formatDiningOption } from '../utils';
    import { cartItems, getTotal, formatCustomizations } from '../stores/cart';
    import { generateOrderNumber } from '../utils';
    
    // Props definition
    let {
        showPrintButton = true,
        orderDate = new Date()
    }: {
        showPrintButton?: boolean;
        orderDate?: Date;
    } = $props();
    
    // Generate a random order number if not provided
    const orderNumber = $state(generateOrderNumber());
    
    // Current date/time
    const formattedDate = $derived(formatDate(orderDate));
    const formattedTime = $derived(formatTime(orderDate));
    
    // Calculate subtotal, tax, and total
    const subtotal = $derived(Number(getTotal()));
    const taxRate = $state(0.0825); // 8.25% tax rate
    const tax = $derived(subtotal * taxRate);
    const total = $derived(subtotal + tax);
    
    // Format date as MM/DD/YYYY
    function formatDate(date: Date): string {
        return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
    }
    
    // Format time as HH:MM AM/PM
    function formatTime(date: Date): string {
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // The hour '0' should be '12'
        return `${hours}:${minutes} ${ampm}`;
    }
    
    // Print the receipt
    function printReceipt(): void {
        window.print();
    }
</script>

<div class="bg-white p-6 max-w-md mx-auto">
    <!-- Receipt Header -->
    <div class="text-center mb-4">
        <h1 class="text-xl font-bold">Burger Express</h1>
        <p class="text-sm">123 Fast Food Lane</p>
        <p class="text-sm">Foodville, FB 12345</p>
        <p class="text-sm">Tel: (555) 123-4567</p>
        <div class="my-2 border-t border-b border-gray-300 py-2">
            <p class="font-semibold">Order #{orderNumber}</p>
            <p class="text-sm">{formattedDate} at {formattedTime}</p>
        </div>
    </div>
    
    <!-- Order Items -->
    <div class="mb-4">
        <table class="w-full text-sm">
            <thead class="border-b border-gray-300">
                <tr>
                    <th class="text-left py-1">Item</th>
                    <th class="text-center py-1">Qty</th>
                    <th class="text-right py-1">Price</th>
                    <th class="text-right py-1">Total</th>
                </tr>
            </thead>
            <tbody>
                {#each cartItems as item}
                    <tr class="border-b border-dashed border-gray-200">
                        <td class="py-2">
                            <div class="font-medium">{item.name}</div>
                            {#if item.customizations && item.customizations.length > 0}
                                <div class="text-xs text-gray-500">{formatCustomizations(item.customizations)}</div>
                            {/if}
                        </td>
                        <td class="text-center py-2">{item.quantity}</td>
                        <td class="text-right py-2">${item.price.toFixed(2)}</td>
                        <td class="text-right py-2">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
    
    <!-- Totals -->
    <div class="mb-4">
        <div class="flex justify-between py-1">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
        </div>
        <div class="flex justify-between py-1">
            <span>Tax ({(taxRate * 100).toFixed(2)}%):</span>
            <span>${tax.toFixed(2)}</span>
        </div>
        <div class="flex justify-between py-1 font-bold border-t border-gray-300 mt-1 pt-2">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
        </div>
    </div>
    
    <!-- Footer -->
    <div class="text-center text-sm mt-6">
        <p>Thank you for your order!</p>
        <p>Please come again soon.</p>
        <p class="text-xs mt-4">www.burgerexpress.com</p>
    </div>
    
    <!-- Print Button - Only shown on screen, not when printing -->
    {#if showPrintButton}
        <div class="mt-6 print-hidden">
            <button 
                onclick={printReceipt}
                class="w-full bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary-focus transition-colors"
            >
                Print Receipt
            </button>
        </div>
    {/if}
</div>

<style>
    @media print {
        .print-hidden {
            display: none !important;
        }
        
        @page {
            margin: 0.5cm;
        }
        
        body {
            font-size: 12pt;
        }
    }
</style>