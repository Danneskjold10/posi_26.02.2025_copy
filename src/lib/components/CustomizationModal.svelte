<!-- src/lib/components/CustomizationModal.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { MenuItem } from '../stores/cart';
    import Modal from './Modal.svelte';
    import SizeSelector from './SizeSelector.svelte';
    import VegetableSelector from './VegetableSelector.svelte';
    import SauceSelector from './SauceSelector.svelte';
    
    // Props
    let { 
        item, 
        isOpen = false 
    }: { 
        item: MenuItem; 
        isOpen?: boolean;
    } = $props();
    
    // Animation states for arrows
    let rightArrowOffset = $state(false);
    let leftArrowOffset = $state(false);
    
    // Current step in the customization process
    let currentStep = $state(-1); // Start at -1 for the size selector
    let carouselSelectedSize = $state(2); // Default to LG (index 2)
    
    // Define size options
    let sizeOptions = $state(["SM", "MD", "LG", "XL", "2XL"]);
    
    // Progress step icons
    const stepIcons = ["📏", "🥬", "🧀", "🥫"]; // Size, Vegetables, Cheese, Sauce
    
    // Price constants
    const SIZE_UPGRADE_COST = 1.50;   // Cost per size upgrade (LG -> XL, XL -> 2XL)
    const SIZE_DOWNGRADE_DISCOUNT = 0.75; // Discount per size downgrade (LG -> MD, MD -> SM)
    const DEFAULT_SIZE_INDEX = 2;     // LG is the default size (index 2)
    
    // Customization options based on item type
    let customizationOptions = $state<{
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
    }[]>([]);
    
    const dispatch = createEventDispatcher<{
        close: void;
        addToCart: { item: MenuItem; customizations: any[] };
    }>();
    
    // Set up animation interval
    $effect(() => {
        const arrowInterval = setInterval(() => {
            rightArrowOffset = !rightArrowOffset;
            leftArrowOffset = !leftArrowOffset;
        }, 5000);
        
        // Return cleanup function
        return () => {
            clearInterval(arrowInterval);
        };
    });
    
    // Setup customization options and reset step when props change
    $effect(() => {
        if (item && isOpen) {
            setupCustomizationOptions();
            // Reset step when modal opens
            currentStep = -1;
            carouselSelectedSize = 2; // Default to LG (index 2)
        }
    });

    // Handle SizeSelector value changes
    $effect(() => {
        console.log('Size changed to:', carouselSelectedSize);
    });
    
    function setupCustomizationOptions(): void {
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
                        { id: 11, name: "American", image: "/cheese/cheddar1.svg", price: 0, selected: true },
                        { id: 12, name: "Cheddar", image: "/cheese/cheddar1.svg", price: 0.50, selected: false },
                        { id: 13, name: "Swiss", image: "/cheese/cheddar2.svg", price: 0.50, selected: false },
                        { id: 14, name: "No Cheese", image: "/cheese/cheddar2.svg", price: 0, selected: false }
                    ]
                },
                {
                    category: "Sauce",
                    icon: "🥫",
                    options: [
                        { id: 21, name: "Ketchup", image: "/sauce/ketchup1.svg", price: 0, selected: true, intensity: 1 },
                        { id: 22, name: "Mustard", image: "/sauce/mustard1.svg", price: 0, selected: false, intensity: -1 },
                        { id: 23, name: "Mayo", image: "/sauce/mayonnaise1.svg", price: 0, selected: true, intensity: 1 },
                        { id: 24, name: "BBQ", image: "/sauce/mayonnaise2.svg", price: 0, selected: false, intensity: -1 },
                        { id: 25, name: "Special Sauce", image: "/sauce/mustard4.svg", price: 0.50, selected: false, intensity: -1 }
                    ]
                }
            ];
        } else if (firstDigit === 2) { // Chicken
            customizationOptions = [
                {
                    category: "Sauce",
                    icon: "🥫",
                    options: [
                        { id: 21, name: "Ranch", image: "/sauce/ketchup1.svg", price: 0, selected: true, intensity: 1 },
                        { id: 22, name: "Buffalo", image: "/sauce/mustard1.svg", price: 0, selected: false, intensity: -1 },
                        { id: 23, name: "Honey Mustard", image: "/sauce/mustard2.svg", price: 0, selected: false, intensity: -1 },
                        { id: 24, name: "BBQ", image: "/sauce/barbecue1.svg", price: 0, selected: false, intensity: -1 }
                    ]
                },
                {
                    category: "Extras",
                    icon: "➕",
                    options: [
                        { id: 31, name: "Lettuce", image: "/veggies/lettuce.svg", price: 0, selected: true },
                        { id: 32, name: "Tomato", image: "/veggies/tomato.svg", price: 0, selected: true },
                        { id: 33, name: "Cheese", image: "/cheese/swiss cheese1.svg", price: 0.50, selected: false }
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
    
    // Close the modal
    function closeModal(): void {
        dispatch('close');
    }
    
    // Stop event propagation to prevent backdrop events
    function handleModalClick(e: MouseEvent): void {
        e.stopPropagation();
    }
    
    // Proceed from size selector to first customization step
    function moveFromSizeSelector(): void {
        currentStep = 0;
    }
    
    // Go to next step
    function nextStep(): void {
        if (currentStep < customizationOptions.length - 1) {
            currentStep++;
        } else {
            // If this is the last step, add to cart
            addCustomizedItem();
        }
    }
    
    // Go to previous step
    function prevStep(): void {
        if (currentStep > -1) {
            currentStep--;
        }
    }
    
    // Go to a specific step
    function goToStep(step: number): void {
        if (step >= -1 && step <= customizationOptions.length - 1) {
            currentStep = step;
        }
    }
    
    // Toggle selection
    function toggleSelection(optionIndex: number): void {
        // For mutual exclusivity in certain categories
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
        const sizeDiff = carouselSelectedSize - DEFAULT_SIZE_INDEX;
        
        if (sizeDiff > 0) {
            extraCost += sizeDiff * SIZE_UPGRADE_COST; // $1.50 per size upgrade above LG
        } else if (sizeDiff < 0) {
            extraCost += sizeDiff * SIZE_DOWNGRADE_DISCOUNT; // $0.75 per size downgrade below LG (discount)
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
    
    // Helper function to calculate only size-related price adjustments
    function calculateSizePrice(): number {
        const sizeDiff = carouselSelectedSize - DEFAULT_SIZE_INDEX;
        
        if (sizeDiff > 0) {
            return sizeDiff * SIZE_UPGRADE_COST;
        } else if (sizeDiff < 0) {
            return sizeDiff * SIZE_DOWNGRADE_DISCOUNT;
        }
        
        return 0;
    }
    
    // Debug function - can be used to trace price calculations
    function debugPriceCalculation(): string {
        const basePrice = item.price;
        const sizePrice = calculateSizePrice();
        const ingredientsPrice = calculateIngredientsCost();
        const totalExtra = calculateExtraCost();
        const finalPrice = basePrice + totalExtra;
        
        return `
        Base Price: $${basePrice.toFixed(2)}
        Size Adjustment: $${sizePrice.toFixed(2)}
        Ingredients Extra: $${ingredientsPrice.toFixed(2)}
        Total Extra: $${totalExtra.toFixed(2)}
        Final Price: $${finalPrice.toFixed(2)}
        `;
    }
    
    // Calculate the current price with all customizations
    const currentPrice = $derived(item.price + calculateExtraCost());
    
    // Get the current step title
    const currentStepTitle = $derived(currentStep === -1 
        ? "Select Size" 
        : customizationOptions[currentStep]?.category || 'Customize');
    
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
    
    // Create handler for size selection
    function handleSizeForward(): void {
        moveFromSizeSelector();
    }
    
    // Create handler for each step
    function createStepHandler(step: number): () => void {
        return function() {
            goToStep(step);
        };
    }
    
    // Create handler for option selection
    function createOptionHandler(optionIndex: number): () => void {
        return function() {
            toggleSelection(optionIndex);
        };
    }
    
    // Key event handler for keyboard navigation
    function handleKeydown(event: KeyboardEvent, action: () => void): void {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            action();
        }
    }
    
    // Add to cart with customizations
    function addCustomizedItem(): void {
        const selectedCustomizations = [
            {
                category: "Size",
                selections: [{
                    name: sizeOptions[carouselSelectedSize],
                    price: calculateSizePrice()
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
                price: currentPrice // Use the calculated current price
            },
            customizations: selectedCustomizations
        });
        
        closeModal();
    }
</script>

<!-- Use the modal portal for overlay -->
{#if isOpen}
<Modal>
    <!-- Backdrop with accessible button for closing -->
    <div class="fixed inset-0 bg-black/70 w-full h-full" role="presentation">
        <button 
            class="absolute inset-0 w-full h-full border-none bg-transparent cursor-default"
            aria-label="Close modal"
            onclick={closeModal}
            onkeydown={e => handleKeydown(e, closeModal)}
        ></button>
        
        <!-- Modal container -->
        <div 
            class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[98%] max-w-6xl overflow-hidden rounded-xl shadow-2xl burger-king-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onclick={handleModalClick}
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
                    <div class="flex items-center flex-wrap">
                        <span class="text-sm font-semibold">Base Price: ${item.price.toFixed(2)}</span>
                        {#if calculateExtraCost() !== 0}
                            <span class="text-sm {calculateExtraCost() > 0 ? 'text-orange-600' : 'text-green-600'} ml-2">
                                {calculateExtraCost() > 0 ? '+' : ''}${calculateExtraCost().toFixed(2)}
                            </span>
                            <span class="text-sm font-bold ml-2">= ${currentPrice.toFixed(2)}</span>
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
                    onclick={closeModal}
                    aria-label="Close modal"
                >
                    ✕
                </button>
            </div>
            
            <!-- Optional debug info - uncomment during development -->
            <!-- <div class="text-xs bg-gray-100 p-2 font-mono">
                <pre>{debugPriceCalculation()}</pre>
            </div> -->
            
            <!-- Progress indicator with dashed lines connecting boxes -->
            <div class="bg-orange-50 px-4 py-6 relative">
                <!-- Steps container with positioning -->
                <div class="flex justify-center items-center">
                    <!-- Step boxes with connector lines -->
                    <div class="flex items-center">
                        <!-- Size step -->
                        <button 
                            class="flex flex-col items-center focus:outline-none z-10"
                            onclick={createStepHandler(-1)}
                            onkeydown={e => handleKeydown(e, createStepHandler(-1))}
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
                                    onclick={createStepHandler(i)}
                                    onkeydown={e => handleKeydown(e, createStepHandler(i))}
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
                <!-- Size selection step without bind: -->
                <SizeSelector
                    selectedSize={carouselSelectedSize}
                    sizes={sizeOptions}
                    moveForward={handleSizeForward}
                />
            {:else}
                {#if customizationOptions[currentStep].category === "Vegetables"}
                    <!-- Use the VegetableSelector for Vegetables category with proper binding -->
                    <VegetableSelector 
                        bind:options={customizationOptions[currentStep].options}
                        moveForward={nextStep}
                        moveBackward={prevStep}
                        on:optionsChange={({ detail }) => {
                            // Handle options change if binding doesn't work
                            customizationOptions[currentStep].options = detail.options;
                        }}
                    />
                {:else if customizationOptions[currentStep].category === "Sauce"}
                    <!-- Use the SauceSelector for Sauce category with proper binding -->
                    <SauceSelector 
                        bind:options={customizationOptions[currentStep].options}
                        moveForward={nextStep}
                        moveBackward={prevStep}
                        on:optionsChange={({ detail }) => {
                            // Handle options change if binding doesn't work
                            customizationOptions[currentStep].options = detail.options;
                        }}
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
                                            onclick={createOptionHandler(optionIndex)}
                                            aria-pressed={option.selected}
                                            aria-label="{option.name} {option.price > 0 ? '(+$' + option.price.toFixed(2) + ')' : ''}"
                                        >
                                            <div class="w-20 h-20 mb-3 flex items-center justify-center text-5xl">
                                                <img 
                                                    src={option.image} 
                                                    alt="" 
                                                    class="w-full h-full object-contain"
                                                    onerror={e => {
                                                        const imgElement = e.target as HTMLImageElement;
                                                        if (imgElement) {
                                                            imgElement.style.display = 'none';
                                                            const nextSibling = imgElement.nextElementSibling as HTMLElement;
                                                            if (nextSibling) {
                                                                nextSibling.style.display = 'block';
                                                            }
                                                        }
                                                    }}
                                                    aria-hidden="true"
                                                />
                                                <span class="hidden">
                                                    {(() => {
                                                        switch (option.name.toLowerCase()) {
                                                            case 'american': case 'cheddar': case 'swiss': return '🧀';
                                                            default: return '🍔';
                                                        }
                                                    })()}
                                                </span>
                                            </div>
                                            <span class="text-base font-medium">{option.name}</span>
                                            {#if option.price > 0}
                                                <div class="flex items-center mt-1 text-sm px-2 py-0.5 rounded-full bg-orange-100">
                                                    <span class="text-orange-600 font-semibold">+${option.price.toFixed(2)}</span>
                                                    {#if option.selected}
                                                        <span class="ml-1 w-2 h-2 rounded-full bg-orange-500"></span>
                                                    {/if}
                                                </div>
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
                                            onclick={createStepHandler(-1)}
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
                                            onclick={prevStep}
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
                                        onclick={nextStep}
                                        disabled={!isCurrentCategoryValid()}
                                    >
                                        <span>{currentStep < customizationOptions.length - 1 ? 'Next' : 'Add to Order · $' + currentPrice.toFixed(2)}</span>
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