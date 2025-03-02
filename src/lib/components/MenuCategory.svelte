<!-- src/lib/components/MenuCategory.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { addToCart } from '../stores/cart';
  import type { MenuItem } from '../stores/cart';
  import CustomizationModal from './CustomizationModal.svelte';

  export let item: MenuItem;
  
  // Determine if this item requires customization
  $: requiresCustomization = isCustomizableItem(item.id);

  // State for modal
  let showModal = false;
  
  function isCustomizableItem(id: number): boolean {
    // Check first digit of id
    const categoryId = Math.floor(id / 100);
    // Burgers (1xx), Chicken (2xx), and Combos (6xx) are customizable
    return categoryId === 1 || categoryId === 2 || categoryId === 6;
  }
  
  // Determine if item is eligible for combo flow (only main items like burgers and chicken)
  function isComboEligible(id: number): boolean {
    const categoryId = Math.floor(id / 100);
    return categoryId === 1 || categoryId === 2; // Burgers and Chicken
  }
  
  function handleAddToCart(): void {
    if (requiresCustomization) {
      // Open the customization modal
      showModal = true;
    } else {
      // Simple add for non-customizable items
      addToCart(item);
    }
  }
  
  function handleCloseModal() {
    showModal = false;
  }
  
  function handleAddCustomizedItem(event: CustomEvent) {
    const { item: customizedItem, customizations } = event.detail;
    
    // Add item with customizations to cart
    addToCart({
      ...customizedItem,
      description: `${customizedItem.description} (Customized)`,
      customizations: customizations
    });
    
    // Close the modal
    showModal = false;
    
    // If item is eligible for combo, navigate to combo selection
    if (isComboEligible(customizedItem.id)) {
      goto('/combo-selection');
    }
  }
</script>

<div class="card bg-base-100 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:translate-y-[-5px] group">
  <figure class="relative h-48 overflow-hidden">
    <img
      src={item.image || "/placeholder-food.jpg"}
      alt={item.name}
      class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <!-- Customizable indicator -->
    {#if requiresCustomization}
      <div class="absolute top-2 right-2 bg-primary text-primary-content text-xs px-2 py-1 rounded-full">
        Customizable
      </div>
    {/if}
  </figure>
  
  <div class="card-body p-4">
    <h3 class="card-title text-lg font-bold">{item.name}</h3>
    <p class="text-sm text-gray-600 line-clamp-2">{item.description}</p>
    
    <div class="flex justify-between items-center mt-4 pt-2 border-t border-base-200">
      <span class="text-xl font-bold">${item.price.toFixed(2)}</span>
      <button
        class="relative overflow-hidden btn btn-sm px-4 bg-primary hover:bg-primary-focus text-primary-content group-hover:scale-105 transition-all duration-300 border-2 border-primary-focus"
        on:click={handleAddToCart}
      >
        <!-- Pulsing glow effect -->
        <span class="absolute inset-0 rounded bg-white/30 opacity-0 group-hover:animate-pulse"></span>
        
        <!-- Button content -->
        <span class="relative z-10 font-bold">{requiresCustomization ? '+ Customize' : '+ Add'}</span>
      </button>
    </div>
  </div>
  
  <!-- Customization Modal -->
  <CustomizationModal
    {item}
    isOpen={showModal}
    on:close={handleCloseModal}
    on:addToCart={handleAddCustomizedItem}
  />
</div>