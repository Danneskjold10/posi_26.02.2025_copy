<!-- src/lib/components/MenuItem.svelte -->
<script lang="ts">
  import { addToCart } from '../stores/cart';
  import type { MenuItem } from '../stores/cart';
  
  // Define props correctly using Svelte 5 syntax
  let { item }: { item: MenuItem } = $props();
  
  function handleAddToCart(): void {
      addToCart(item);
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
  </figure>
  
  <div class="card-body p-4">
      <h3 class="card-title text-lg font-bold">{item.name}</h3>
      <p class="text-sm text-gray-600 line-clamp-2">{item.description}</p>
      
      <div class="flex justify-between items-center mt-4 pt-2 border-t border-base-200">
          <span class="text-xl font-bold">${item.price.toFixed(2)}</span>
          <button 
              class="btn btn-primary btn-sm group-hover:btn-primary group-hover:scale-105 transition-all duration-300" 
              onclick={handleAddToCart}
          >
              Add to Order
          </button>
      </div>
  </div>
</div>