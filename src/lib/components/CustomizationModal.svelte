<!-- src/lib/components/CustomizationModal.svelte -->
<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import type { MenuItem } from '../stores/cart';
  import Modal from './Modal.svelte';
  import SizeSelector from './SizeSelector.svelte';
  import VegetableSelector from './VegetableSelector.svelte';
  import SauceSelector from './SauceSelector.svelte';

  
  export let item: MenuItem;
  export let isOpen: boolean = false;
  
  // Animation states for arrows
  let rightArrowOffset = false;
  let leftArrowOffset = false;
  
  // Customization options based on item type
  let customizationOptions: {
    category: string;
    icon: string;
    options: { 
      id: number; 
      name: string; 
      image: string; 
      price: number; 
      selected: boolean;
      intensity?: number; // -1: not selected, 0: light, 1: regular, 2: extra
    }[];
  }[] = [];
  
  // Current step in the customization process
  let currentStep = -1; // Start at -1 for the size selector
  let carouselSelectedSize = 2; // Default to LG (index 2)
  
  // Define size options
  let sizeOptions = ["SM", "MD", "LG", "XL", "2XL"];
  
  // Progress step icons
  const stepIcons = ["📏", "🥬", "🧀", "🥫"]; // Size, Vegetables, Cheese, Sauce
  
  const dispatch = createEventDispatcher<{
    close: void;
    addToCart: { item: MenuItem; customizations: any[] };
  }>();
  
  // Set up animation interval
  onMount(() => {
    const arrowInterval = setInterval(() => {
      rightArrowOffset = !rightArrowOffset;
      leftArrowOffset = !leftArrowOffset;
    }, 5000);
    
    return () => {
      clearInterval(arrowInterval);
    };
  });
  
  // Set up different customization options based on the item
  $: {
    if (item) {
      // Get category from item id - first digit represents category
      const firstDigit = Math.floor(item.id / 100);
      
      if (firstDigit === 1) { // Burgers
        customizationOptions = [
          {
            category: "Vegetables",
            icon: "🥬",
            options: [
              { id: 1, name: "Lettuce", image: "/veggies/lettuce.svg", price: 0, selected: true },
              { id: 2, name: "Tomato", image: "/veggies/tomato.svg", price: 0, selected: true },
              { id: 3, name: "Onions", image: "/veggies/onion.svg", price: 0, selected: false },
              { id: 4, name: "Pickles", image: "/veggies/pickle.svg", price: 0, selected: false },
              { id: 5, name: "Jalapeños", image: "/veggies/jalapeno.svg", price: 0.50, selected: false }
            ]
          },
          {
            category: "Cheese",
            icon: "🧀",
            options: [
              { id: 11, name: "American", image: "/cheese/american.svg", price: 0, selected: true },
              { id: 12, name: "Cheddar", image: "/cheese/cheddar.svg", price: 0.50, selected: false },
              { id: 13, name: "Swiss", image: "/cheese/swiss.svg", price: 0.50, selected: false },
              { id: 14, name: "No Cheese", image: "/cheese/no-cheese.svg", price: 0, selected: false }
            ]
          },
          {
            category: "Sauce",
            icon: "🥫",
            options: [
              { id: 21, name: "Ketchup", image: "/sauce/ketchup.svg", price: 0, selected: true, intensity: 1 },
              { id: 22, name: "Mustard", image: "/sauce/mustard.svg", price: 0, selected: false, intensity: -1 },
              { id: 23, name: "Mayo", image: "/sauce/mayo.svg", price: 0, selected: true, intensity: 1 },
              { id: 24, name: "BBQ", image: "/sauce/bbq.svg", price: 0, selected: false, intensity: -1 },
              { id: 25, name: "Special Sauce", image: "/sauce/special.svg", price: 0.50, selected: false, intensity: -1 }
            ]
          }
        ];
      } else if (firstDigit === 2) { // Chicken
        customizationOptions = [
          {
            category: "Sauce",
            icon: "🥫",
            options: [
              { id: 21, name: "Ranch", image: "/sauce/ranch.svg", price: 0, selected: true, intensity: 1 },
              { id: 22, name: "Buffalo", image: "/sauce/buffalo.svg", price: 0, selected: false, intensity: -1 },
              { id: 23, name: "Honey Mustard", image: "/sauce/honey-mustard.svg", price: 0, selected: false, intensity: -1 },
              { id: 24, name: "BBQ", image: "/sauce/bbq.svg", price: 0, selected: false, intensity: -1 }
            ]
          },
          {
            category: "Extras",
            icon: "➕",
            options: [
              { id: 31, name: "Lettuce", image: "/veggies/lettuce.svg", price: 0, selected: true },
              { id: 32, name: "Tomato", image: "/veggies/tomato.svg", price: 0, selected: true },
              { id: 33, name: "Cheese", image: "/cheese/american.svg", price: 0.50, selected: false }
            ]
          }
        ];
      } else if (firstDigit === 6) { // Combos
        customizationOptions = [
          {
            category: "Sides",
            icon: "🍟",
            options: [
              { id: 41, name: "French Fries", image: "/sides/fries.svg", price: 0, selected: true },
              { id: 42, name: "Onion Rings", image: "/sides/onion-rings.svg", price: 1.00, selected: false },
              { id: 43, name: "Side Salad", image: "/sides/salad.svg", price: 1.00, selected: false }
            ]
          },
          {
            category: "Drinks",
            icon: "🥤",
            options: [
              { id: 51, name: "Cola", image: "/drinks/cola.svg", price: 0, selected: true },
              { id: 52, name: "Diet Cola", image: "/drinks/diet.svg", price: 0, selected: false },
              { id: 53, name: "Lemon-Lime", image: "/drinks/lemon-lime.svg", price: 0, selected: false },
              { id: 54, name: "Orange", image: "/drinks/orange.svg", price: 0, selected: false },
              { id: 55, name: "Water", image: "/drinks/water.svg", price: 0, selected: false }
            ]
          }
        ];
      }
    }
  }
  
  // Reset step when modal opens
  $: if (isOpen) {
    currentStep = -1; // Start at size selector
    carouselSelectedSize = 2; // Default to LG (index 2)
  }
  
  // Close the modal
  function closeModal() {
    dispatch('close');
  }
  
  // Proceed from size selector to first customization step
  function moveFromSizeSelector() {
    currentStep = 0;
  }
  
  // Go to next step
  function nextStep() {
    if (currentStep < customizationOptions.length - 1) {
      currentStep++;
    } else {
      // If this is the last step, add to cart
      addCustomizedItem();
    }
  }
  
  // Go to previous step
  function prevStep() {
    if (currentStep > -1) {
      currentStep--;
    }
  }
  
  // Toggle selection
  function toggleSelection(optionIndex: number) {
    const category = customizationOptions[currentStep];
    
    if (category.category === "Cheese" || category.category === "Sides" || category.category === "Drinks") {
      // Deselect all other options in this category
      category.options.forEach((opt, idx) => {
        if (idx !== optionIndex) {
          opt.selected = false;
        }
      });
    }
    
    // Toggle the selected state of the clicked option
    customizationOptions[currentStep].options[optionIndex].selected = 
      !customizationOptions[currentStep].options[optionIndex].selected;
  }
  
  // Calculate additional cost
  function calculateExtraCost(): number {
    let extraCost = 0;
    
    // Add size upgrade cost if not the default middle size (typically LG)
    const middleIndex = 2; // LG is index 2 in ["SM", "MD", "LG", "XL", "2XL"]
    const sizeDiff = carouselSelectedSize - middleIndex;
    
    if (sizeDiff > 0) {
      extraCost += sizeDiff * 1.50; // $1.50 per size upgrade above LG
    } else if (sizeDiff < 0) {
      extraCost += sizeDiff * 0.75; // $0.75 per size downgrade below LG (discount)
    }
    
    // Add customization costs
    customizationOptions.forEach(category => {
      category.options.forEach(option => {
        if (option.selected) {
          extraCost += option.price;
        }
      });
    });
    
    return extraCost;
  }
  
  // Get the current step title
  $: currentStepTitle = currentStep === -1 
    ? "Select Size" 
    : customizationOptions[currentStep]?.category || 'Customize';
  
  // Add to cart with customizations
  function addCustomizedItem() {
    const selectedCustomizations = [
      {
        category: "Size",
        selections: [{
          name: sizeOptions[carouselSelectedSize],
          price: calculateExtraCost() - calculateIngredientsCost()
        }]
      },
      ...customizationOptions.map(category => {
        return {
          category: category.category,
          selections: category.options.filter(opt => opt.selected).map(opt => {
            // Include intensity information for sauces
            if (category.category === "Sauce" && opt.intensity !== undefined) {
              const intensityLabels = ["Light", "Regular", "Extra"];
              return {
                name: opt.name,
                price: opt.price,
                intensity: opt.intensity,
                intensityLabel: opt.intensity >= 0 && opt.intensity <= 2 ? intensityLabels[opt.intensity] : "Regular"
              };
            } else {
              return {
                name: opt.name,
                price: opt.price
              };
            }
          })
        };
      })
    ];
    
    dispatch('addToCart', {
      item: {
        ...item,
        price: item.price + calculateExtraCost()
      },
      customizations: selectedCustomizations
    });
    
    closeModal();
  }
  
  // Calculate just the ingredient costs (for separating from size cost)
  function calculateIngredientsCost(): number {
    let cost = 0;
    customizationOptions.forEach(category => {
      category.options.forEach(option => {
        if (option.selected) {
          cost += option.price;
        }
      });
    });
    return cost;
  }
  
  // Check if at least one item in current category is selected
  function isCurrentCategoryValid(): boolean {
    if (currentStep === -1) return true; // Size selector step is always valid
    if (!customizationOptions[currentStep]) return true;
    
    // For some categories, require at least one selection
    const category = customizationOptions[currentStep].category;
    if (category === "Cheese" || category === "Sides" || category === "Drinks") {
      return customizationOptions[currentStep].options.some(opt => opt.selected);
    }
    
    // For other categories, it's fine to have none selected
    return true;
  }
  
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
  
  // Handle image error - Svelte way
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
  
  // Handle keyboard navigation for accessibility
  function handleKeydown(event: KeyboardEvent, action: () => void) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  }
</script>

<!-- Use the modal portal for overlay -->
{#if isOpen}
<Modal>
  <!-- Backdrop overlay -->
  <div 
    class="fixed inset-0 bg-black/70 w-full h-full cursor-default" 
    on:click|self={closeModal}
    on:keydown={e => handleKeydown(e, closeModal)}
    role="presentation"
    tabindex="-1"
  >
    <!-- Modal container with Burger King colors -->
    <div 
      class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[98%] max-w-6xl overflow-hidden rounded-xl shadow-2xl burger-king-modal"
      on:click|stopPropagation
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <!-- Consistent header across all steps -->
      <div class="bg-white p-4 flex items-center border-b">
        <!-- Product image and info -->
        <img 
          src={item.image || "/placeholder-food.jpg"} 
          alt={item.name} 
          class="w-16 h-16 object-cover rounded-lg shadow-md mr-4"
        />
        <div class="flex-1">
          <h3 id="modal-title" class="text-lg font-bold">{item.name}</h3>
          <div class="flex items-center">
            <span class="text-sm font-semibold">${item.price.toFixed(2)}</span>
            {#if calculateExtraCost() > 0}
              <span class="text-sm text-orange-600 ml-2">+${calculateExtraCost().toFixed(2)}</span>
            {/if}
            
            <!-- Show selected size if past size selection -->
            {#if currentStep >= 0}
              <span class="ml-3 text-sm">Size: <span class="font-semibold">{sizeOptions[carouselSelectedSize]}</span></span>
            {/if}
          </div>
        </div>
        
        <!-- Close button -->
        <button 
          class="btn btn-sm btn-circle"
          on:click={closeModal}
          aria-label="Close modal"
        >
          ✕
        </button>
      </div>
      
      <!-- Progress indicator with dashed lines connecting boxes -->
      <div class="bg-orange-50 px-4 py-6 relative">
        <!-- Steps container with positioning -->
        <div class="flex justify-center items-center">
          <!-- Step boxes with connector lines -->
          <div class="flex items-center">
            <!-- Size step -->
            <button 
              class="flex flex-col items-center focus:outline-none z-10"
              on:click={() => currentStep = -1}
              on:keydown={e => handleKeydown(e, () => currentStep = -1)}
              disabled={currentStep < -1}
              aria-label="Size step"
            >
              <div class="w-16 h-16 flex items-center justify-center mb-2 transition-colors border-2 border-dashed bg-white
                {currentStep === -1 
                  ? 'bg-orange-500 text-white border-orange-600' 
                  : (currentStep > -1 
                    ? 'bg-orange-200 text-orange-800 border-orange-400' 
                    : 'bg-orange-50 text-gray-600 border-orange-300')}
                rounded-lg shadow-md"
              >
                <span class="text-2xl">{stepIcons[0]}</span>
              </div>
              <span class="text-sm font-medium {currentStep === -1 ? 'text-orange-700' : 'text-gray-600'}">Size</span>
            </button>
            
            <!-- First connecting line -->
            <div class="w-16 h-0 border-t-2 border-dashed mx-1 {currentStep > -1 ? 'border-orange-500' : 'border-orange-300'}"></div>
            
            <!-- Customization steps with connecting lines between them -->
            {#each customizationOptions as option, i}
              <div class="flex items-center">
                <button 
                  class="flex flex-col items-center focus:outline-none z-10"
                  on:click={() => currentStep >= i - 1 ? currentStep = i : null}
                  on:keydown={e => handleKeydown(e, () => currentStep >= i - 1 ? currentStep = i : null)}
                  disabled={i > 0 && currentStep < i - 1}
                  aria-label="{option.category} step"
                >
                  <div class="w-16 h-16 flex items-center justify-center mb-2 transition-colors border-2 border-dashed bg-white
                    {currentStep === i 
                      ? 'bg-orange-500 text-white border-orange-600' 
                      : (currentStep > i 
                        ? 'bg-orange-200 text-orange-800 border-orange-400' 
                        : 'bg-orange-50 text-gray-600 border-orange-300')}
                    rounded-lg shadow-md"
                  >
                    <span class="text-2xl">{option.icon}</span>
                  </div>
                  <span class="text-sm font-medium {currentStep === i ? 'text-orange-700' : 'text-gray-600'}">{option.category}</span>
                </button>
                
                <!-- Don't add a connector after the last item -->
                {#if i < customizationOptions.length - 1}
                  <div class="w-16 h-0 border-t-2 border-dashed mx-1 
                    {currentStep > i ? 'border-orange-500' : 'border-orange-300'}"
                  ></div>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      </div>
      
      <!-- Step title -->
      <div class="bg-orange-100 py-2 px-4 border-b border-orange-200">
        <h4 class="font-semibold text-orange-900">{currentStepTitle}</h4>
      </div>
      
      <!-- Modal content area - Different content for different steps -->
      <div class="bg-orange-50 h-[550px] relative overflow-y-auto">
        {#if currentStep === -1}
          <!-- Size selection step -->
          <SizeSelector
            sizes={sizeOptions}
            bind:selectedSize={carouselSelectedSize}
            moveForward={moveFromSizeSelector}
          />
        {:else}
          {#if customizationOptions[currentStep].category === "Vegetables"}
            <!-- Use the VegetableSelector for Vegetables category -->
            <VegetableSelector 
              bind:options={customizationOptions[currentStep].options}
              moveForward={nextStep}
              moveBackward={prevStep}
            />
          {:else if customizationOptions[currentStep].category === "Sauce"}
            <!-- Use the SauceSelector for Sauce category with intensity bars -->
            <SauceSelector 
              bind:options={customizationOptions[currentStep].options}
              moveForward={nextStep}
              moveBackward={prevStep}
            />
          {:else}
            <!-- Original grid layout for other categories -->
            <div class="w-full h-full relative flex flex-col justify-center items-center pt-12 pb-16">
              <!-- Customization options in a grid -->
              <div class="flex-grow flex items-center justify-center mb-8 mx-auto w-full px-8">
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                  {#each customizationOptions[currentStep].options as option, optionIndex}
                    <button 
                      class="p-4 rounded-lg transition-all duration-200 flex flex-col items-center shadow-md 
                            border-2 border-dashed {option.selected ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-white/80'}
                            hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      on:click={() => toggleSelection(optionIndex)}
                      aria-pressed={option.selected}
                      aria-label="{option.name} {option.price > 0 ? '(+$' + option.price.toFixed(2) + ')' : ''}"
                    >
                      <div class="w-20 h-20 mb-3 flex items-center justify-center text-5xl">
                        <img 
                          src={option.image} 
                          alt="" 
                          class="w-full h-full object-contain"
                          on:error={handleImageError}
                          aria-hidden="true"
                        />
                        <span class="hidden">{getEmojiForOption(option.name)}</span>
                      </div>
                      <span class="text-base font-medium">{option.name}</span>
                      {#if option.price > 0}
                        <span class="text-sm text-orange-600 mt-1">+${option.price.toFixed(2)}</span>
                      {/if}
                      
                      <!-- Checkmark indicator for selected items -->
                      {#if option.selected}
                        <div class="absolute top-2 right-2 bg-orange-500 rounded-full p-1 shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg>
                        </div>
                      {/if}
                    </button>
                  {/each}
                </div>
              </div>
              
              <!-- Bottom controls (navigation buttons) -->
              <div class="w-full px-8 mt-auto">              
                <div class="flex justify-between w-full">
                  {#if currentStep === 0}
                    <button 
                      class="bg-white text-orange-700 border-2 border-orange-500 hover:bg-orange-50 rounded-full px-8 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center"
                      on:click={() => currentStep = -1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" 
                           class="h-5 w-5 mr-2 transition-transform duration-300" 
                           style={leftArrowOffset ? "transform: translateX(-8px)" : "transform: translateX(0)"}
                           viewBox="0 0 20 20" 
                           fill="currentColor">
                        <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                      </svg>
                      <span>Back to Size</span>
                    </button>
                  {:else}
                    <button 
                      class="bg-white text-orange-700 border-2 border-orange-500 hover:bg-orange-50 rounded-full px-8 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center"
                      on:click={prevStep}
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
                  {/if}
                  
                  <button 
                    class="{isCurrentCategoryValid() ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} 
                           rounded-full px-8 py-3 font-medium border-2 border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center"
                    on:click={nextStep}
                    disabled={!isCurrentCategoryValid()}
                  >
                    <span>{currentStep < customizationOptions.length - 1 ? 'Next' : 'Add to Order · $' + (item.price + calculateExtraCost()).toFixed(2)}</span>
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
          {/if}
        {/if}
      </div>
    </div>
  </div>
</Modal>
{/if}

<style>
  /* Burger King colors */
  :global(.burger-king-modal) {
    --bk-orange: #FF8732;
    --bk-red: #D62300;
    --bk-yellow: #FFCB05;
    --bk-brown: #502314;
    --bk-cream: #FFF1DC;
  }
</style>