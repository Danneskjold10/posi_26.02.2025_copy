<!-- src/lib/components/SauceSelector.svelte -->
<script lang="ts">
    import IntensityBar from './IntensityBar.svelte';
    
    // Props
    export let options: { 
      id: number; 
      name: string; 
      image: string; 
      price: number; 
      selected: boolean;
      intensity?: number;
    }[] = [];
    export let moveForward: () => void;
    export let moveBackward: () => void;
    
    // Animation states for arrows
    let rightArrowOffset = false;
    let leftArrowOffset = false;
    
    // Initialize intensity values if they don't exist
    $: {
      options.forEach(option => {
        if (option.intensity === undefined) {
          option.intensity = option.selected ? 1 : -1;
        }
      });
    }
    
    // Toggle sauce selection
    function toggleSauceSelection(index: number) {
      // Create a copy of options to ensure reactivity
      const updatedOptions = [...options];
      updatedOptions[index].selected = !updatedOptions[index].selected;
      
      // Set initial intensity to medium (1) when selected, or -1 when deselected
      if (updatedOptions[index].selected) {
        updatedOptions[index].intensity = 1;
      } else {
        updatedOptions[index].intensity = -1;
      }
      
      // Replace options with updated copy to trigger reactivity
      options = updatedOptions;
    }
    
    // Handle intensity change
    function handleIntensityChange(index: number, level: number) {
      // Only change intensity if the sauce is selected
      if (options[index].selected) {
        // Create a copy of options to ensure reactivity
        const updatedOptions = [...options];
        updatedOptions[index].intensity = level;
        
        // Replace options with updated copy to trigger reactivity
        options = updatedOptions;
      }
    }
    
    // Get label for intensity level
    function getIntensityLabel(level: number): string {
      switch(level) {
        case 0: return 'Light';
        case 1: return 'Regular';
        case 2: return 'Extra';
        default: return 'None';
      }
    }
    
    // Function to get emoji fallback if image doesn't load
    function getEmojiForOption(option: string): string {
      switch (option.toLowerCase()) {
        case 'ketchup': return '🥫';
        case 'mustard': return '🟡';
        case 'mayo': case 'ranch': return '⚪';
        case 'bbq': return '🟤';
        case 'buffalo': return '🔴';
        case 'special sauce': return '🥫';
        case 'honey mustard': return '🟡';
        default: return '🥫';
      }
    }
    
    // Handle image error
    function handleImageError(event: Event) {
      const imgElement = event.target as HTMLImageElement;
      if (imgElement) {
        imgElement.style.display = 'none';
        const nextSibling = imgElement.nextElementSibling as HTMLElement;
        if (nextSibling) {
          nextSibling.style.display = 'block';
        }
      }
    }
  </script>
  
  <div class="flex flex-col h-full w-full px-6 py-4">
    <h2 class="text-lg font-bold text-orange-800 mb-5">Select Sauces & Intensity</h2>
    
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
      {#each options as option, idx}
        <div class="flex flex-col items-center">
          <!-- Sauce Image and Selection -->
          <div 
            class="w-28 h-28 mb-2 p-3 rounded-lg flex items-center justify-center shadow-md border-2 cursor-pointer transition-all
                  {option.selected ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-white/80'}"
            on:click={() => toggleSauceSelection(idx)}
            role="button"
            tabindex="0"
            aria-pressed={option.selected}
          >
            <div class="relative w-full h-full flex items-center justify-center">
              <img 
                src={option.image} 
                alt={option.name}
                class="w-full h-full object-contain {option.selected ? '' : 'opacity-70 grayscale'} transition-all"
                on:error={handleImageError}
              />
              <span class="hidden text-4xl">{getEmojiForOption(option.name)}</span>
              
              <!-- Checkmark indicator for selected items -->
              {#if option.selected}
                <div class="absolute top-0 right-0 bg-orange-500 rounded-full p-1 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              {/if}
            </div>
          </div>
          
          <!-- Sauce Name and Price -->
          <div class="text-center mb-2">
            <span class="font-medium">{option.name}</span>
            {#if option.price > 0}
              <span class="text-sm text-orange-600 block">+${option.price.toFixed(2)}</span>
            {/if}
          </div>
          
          <!-- Intensity Bars -->
          <IntensityBar 
            selected={option.selected} 
            intensity={option.intensity || -1} 
            onIntensityChange={(level) => handleIntensityChange(idx, level)} 
          />
          
          <!-- Intensity Label -->
          {#if option.selected && option.intensity !== undefined}
            <div class="text-xs mt-1 font-medium text-gray-700">
              {getIntensityLabel(option.intensity)}
            </div>
          {/if}
        </div>
      {/each}
    </div>
    
    <!-- Navigation buttons -->
    <div class="mt-auto">
      <div class="flex justify-between w-full">
        <button 
          class="bg-white text-orange-700 border-2 border-orange-500 hover:bg-orange-50 rounded-full px-8 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center"
          on:click={moveBackward}
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
               class="h-5 w-5 mr-2 transition-transform duration-300" 
               style={leftArrowOffset ? "transform: translateX(-8px)" : "transform: translateX(0)"}
               viewBox="0 0 20 20" 
               fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          <span>Back</span>
        </button>
        
        <button 
          class="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-3 font-medium border-2 border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center"
          on:click={moveForward}
        >
          <span>Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" 
               class="h-5 w-5 ml-2 transition-transform duration-300" 
               style={rightArrowOffset ? "transform: translateX(8px)" : "transform: translateX(0)"}
               viewBox="0 0 20 20" 
               fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>