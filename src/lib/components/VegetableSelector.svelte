<!-- src/lib/components/VegetableSelector.svelte -->
<script lang="ts">
    import ToggleList from './ToggleList.svelte';
    
    // Props
    export let options: { id: number; name: string; image: string; price: number; selected: boolean }[] = [];
    export let moveForward: () => void;
    export let moveBackward: () => void;
    
    // Animation states for arrows
    let rightArrowOffset = false;
    let leftArrowOffset = false;
    
    // Computed properties for selected and unselected items
    $: selectedItems = options.filter(option => option.selected);
    $: unselectedItems = options.filter(option => !option.selected);
    
    // Toggle item selection
    function toggleSelectedItem(index: number) {
      const itemToToggle = selectedItems[index];
      if (itemToToggle) {
        // Create a copy of options to ensure reactivity
        const updatedOptions = [...options];
        const originalIndex = updatedOptions.findIndex(opt => opt.id === itemToToggle.id);
        if (originalIndex !== -1) {
          updatedOptions[originalIndex].selected = false;
          // Replace options with updated copy to trigger reactivity
          options = updatedOptions;
        }
      }
    }
    
    function toggleUnselectedItem(index: number) {
      const itemToToggle = unselectedItems[index];
      if (itemToToggle) {
        // Create a copy of options to ensure reactivity
        const updatedOptions = [...options];
        const originalIndex = updatedOptions.findIndex(opt => opt.id === itemToToggle.id);
        if (originalIndex !== -1) {
          updatedOptions[originalIndex].selected = true;
          // Replace options with updated copy to trigger reactivity
          options = updatedOptions;
        }
      }
    }
    
    // All/None selection
    function selectAll() {
      // Make a copy of the options array to trigger reactivity
      const updatedOptions = [...options];
      // Update all items to be selected
      updatedOptions.forEach(opt => opt.selected = true);
      // Replace the options array with the updated copy
      options = updatedOptions;
    }
    
    function selectNone() {
      // Make a copy of the options array to trigger reactivity
      const updatedOptions = [...options];
      // Update all items to be unselected
      updatedOptions.forEach(opt => opt.selected = false);
      // Replace the options array with the updated copy
      options = updatedOptions;
    }
    
    // Check if all items are selected/unselected
    $: allSelected = options.every(opt => opt.selected);
    $: allUnselected = options.every(opt => !opt.selected);
    
    // Function to get emoji fallback if image doesn't load
    function getEmojiForOption(option: string): string {
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
  </script>
  
  <div class="flex flex-col h-full w-full px-6 py-4">
    <!-- Selected items section -->
    <div class="flex-1 mb-4">
      <h2 class="text-lg font-bold text-orange-800 mb-3 flex items-center">
        <span class="mr-2">✓</span> Selected
      </h2>
      
      {#if selectedItems.length > 0}
        <ToggleList 
          items={selectedItems} 
          onToggle={toggleSelectedItem}
          {getEmojiForOption}
        />
      {:else}
        <div class="flex justify-center items-center h-28 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
          <p class="text-gray-500 text-center">No items selected.<br>Select items from options below.</p>
        </div>
      {/if}
    </div>
    
    <!-- Available options section -->
    <div class="flex-1 mb-6">
      <h2 class="text-lg font-bold text-orange-800 mb-3">Options</h2>
      
      {#if unselectedItems.length > 0}
        <ToggleList 
          items={unselectedItems} 
          onToggle={toggleUnselectedItem}
          {getEmojiForOption}
        />
      {:else}
        <div class="flex justify-center items-center h-28 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
          <p class="text-gray-500 text-center">All items selected</p>
        </div>
      {/if}
    </div>
    
    <!-- All/None buttons -->
    <div class="flex justify-center gap-3 mb-4">
      <button 
        class="bg-orange-200 hover:bg-orange-300 text-orange-800 px-6 py-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        on:click={selectAll}
        disabled={allSelected}
      >
        Select All
      </button>
      <button 
        class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        on:click={selectNone}
        disabled={allUnselected}
      >
        Select None
      </button>
    </div>
    
    <!-- Navigation buttons -->
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