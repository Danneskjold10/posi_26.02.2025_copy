<!-- src/lib/components/ToggleList.svelte -->
<script lang="ts">
  import { handleImageError } from '../utils';
  
  // Props definition
  let {
      items = [],
      onToggle,
      getEmojiForOption
  }: {
      items: { 
          id: number; 
          name: string; 
          image: string; 
          price: number; 
          selected: boolean 
      }[];
      onToggle: (index: number) => void;
      getEmojiForOption: (option: string) => string;
  } = $props();
  
  // Create handler functions for each item
  function createToggleHandler(index: number) {
      return function() {
          onToggle(index);
      };
  }
</script>

<div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
  {#each items as item, index}
      <button 
          class="p-4 rounded-lg transition-all duration-200 flex flex-col items-center shadow-md 
                border-2 border-dashed border-orange-500 bg-orange-50
                hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500"
          onclick={createToggleHandler(index)}
          aria-pressed={item.selected}
          aria-label="{item.name} {item.price > 0 ? '(+$' + item.price.toFixed(2) + ')' : ''}"
      >
          <div class="w-16 h-16 mb-3 flex items-center justify-center text-4xl">
              <img 
                  src={item.image} 
                  alt="" 
                  class="w-full h-full object-contain"
                  onerror={handleImageError}
                  aria-hidden="true"
              />
              <span class="hidden">{getEmojiForOption(item.name)}</span>
          </div>
          <span class="text-base font-medium">{item.name}</span>
          {#if item.price > 0}
              <span class="text-sm text-orange-600 mt-1">+${item.price.toFixed(2)}</span>
          {/if}
      </button>
  {/each}
</div>