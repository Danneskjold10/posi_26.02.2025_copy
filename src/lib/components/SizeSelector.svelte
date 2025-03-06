<!-- src/lib/components/SizeSelector.svelte -->
<script lang="ts">
    // Props definition
    let {
        sizes = ["SM", "MD", "LG", "XL", "2XL"],
        selectedSize = 2,
        moveForward
    }: {
        sizes?: string[];
        selectedSize?: number;
        moveForward: () => void;
    } = $props();
    
    // Carousel parameters
    const perspectiveFactor: number = 2;
    const translationFactor: number = 1.1;
    const carouselArcDeg: number = 90;
    
    // State
    let carouselClientWidth = $state(0);
    let item3dtranslation = $state(0);
    let currdeg = $state(0);
    
    // Derived values
    const carousel3dLen = $derived(sizes.length);
    const carouselStepDeg = $derived(
        carouselArcDeg / (carousel3dLen > 1 ? carousel3dLen - 1 : carousel3dLen)
    );
    
    // Initialize with default values using $effect instead of onMount
    $effect(() => {
        // Set to middle item initially if not already set
        if (selectedSize === undefined) {
            selectedSize = Math.floor((carousel3dLen - 1) / 2);
        }
        updateCarouselValues();
    });
    
    // Update values when selection changes
    $effect(() => {
        if (selectedSize !== undefined) {
            updateCarouselValues();
        }
    });
    
    function updateCarouselValues(): void {
        item3dtranslation = 0.5 * carouselClientWidth / Math.tan((0.5 * carouselStepDeg) * (Math.PI / 180));
        currdeg = selectedSize * carouselStepDeg;
    }
    
    // Fixed: Enhanced handleSizeSelection to prevent event propagation
    function handleSizeSelection(d: number, event: Event): void {
        if (event) {
            event.stopPropagation(); // Prevent event bubbling
        }
        console.log('Size selected:', d, sizes[d]); // Debug log
        selectedSize = d; // Update the state
        updateCarouselValues(); // Ensure carousel updates immediately
    }
    
    // Fixed: Enhanced forward click handler to stop propagation and log
    function handleForwardClick(event: Event): void {
        if (event) {
            event.stopPropagation();
        }
        console.log("Moving forward with size:", sizes[selectedSize]);
        moveForward(); // Call the function passed as a prop
    }
    
    // Keyboard event handler for accessibility
    function handleKeyDown(event: KeyboardEvent, action: (e: Event) => void): void {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            action(event);
        }
    }
</script>
  
<div class="w-full h-full relative flex flex-col justify-center items-center bg-pink-100 pt-12 pb-16">
    <!-- Carousel container -->
    <div class="carouselSize flex-grow flex items-center justify-center mb-24 mt-8 mx-auto relative">
        <div 
            class="h-full aspect-square relative preserve3d" 
            bind:clientWidth={carouselClientWidth} 
            style="perspective:{perspectiveFactor * carouselClientWidth}px;"
        >
            <div 
                class="w-full h-full absolute preserve3d chngng" 
                style="transform:translateZ(-{translationFactor * item3dtranslation}px) rotateY(-{currdeg}deg);"
            >
                {#each sizes as size, d}
                    <!-- Fixed: Updated button with explicit event handling -->
                    <button 
                        onclick={(event) => handleSizeSelection(d, event)}
                        onkeydown={(event) => handleKeyDown(event, (e) => handleSizeSelection(d, e))}
                        class="btn size-button {selectedSize === d ? 'bg-green-600 text-white' : 'bg-white/70 text-gray-700'} 
                             w-full h-full absolute opacity-80 flex items-center justify-center border border-gray-300 
                             font-bold text-2xl rounded-lg shadow-md"
                        style="transform: rotateY({d * carouselStepDeg}deg) translateZ({(selectedSize === d ? translationFactor : 1) * item3dtranslation}px); 
                               scale: 0.85;"
                        aria-pressed={selectedSize === d}
                        tabindex="0"
                    >
                        {size}
                    </button>
                {/each}
            </div>
        </div>
    </div>
    
    <!-- Bottom Controls Container -->
    <div class="w-full px-8 pb-4 relative mt-auto">
        <!-- Carousel Navigation Controls -->
        <div class="w-full mb-4">
            <input 
                class="range range-xs w-full" 
                type="range" 
                min="0" 
                max={carousel3dLen - 1} 
                step="1" 
                value={selectedSize}
                oninput={(e) => handleSizeSelection(parseInt(e.currentTarget.value), e)}
                aria-label="Size selection slider"
            />
        </div>
        
        <!-- Carousel Labels with click functionality -->
        <div class="flex justify-between w-full px-1 mb-8 text-sm">
            {#each sizes as size, d}
                <button
                    onclick={(event) => handleSizeSelection(d, event)} 
                    class={`${selectedSize === d ? 'font-bold text-amber-800' : 'text-gray-600'} px-2 py-1 rounded hover:bg-amber-100 transition-colors`}
                    aria-pressed={selectedSize === d}
                >
                    {size}
                </button>
            {/each}
        </div>
        
        <!-- Forward Button (Centered) -->
        <div class="flex justify-center w-full">
            <!-- Fixed: Updated button with explicit event handling -->
            <button 
                class="bg-amber-500 hover:bg-amber-600 text-white py-3 px-8 rounded-full flex items-center space-x-2 transition-colors"
                onclick={(event) => handleForwardClick(event)}
                onkeydown={(event) => handleKeyDown(event, handleForwardClick)}
                aria-label="Continue with selected size"
            >
                <span class="font-medium">Next</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
    </div>
</div>
  
<style>
    .carouselSize {
        width: calc(.7 * min(100vw, 100vh));
        aspect-ratio: 2;
    }
    
    /* Fixed: Updated preserve3d styles to ensure clickability */
    .preserve3d {
        transform-style: preserve-3d;
        pointer-events: none; /* Let clicks pass through to children */
    }
    
    /* Fixed: Ensure buttons can receive clicks */
    .size-button {
        pointer-events: auto !important; /* Make buttons clickable */
        cursor: pointer !important;
        z-index: 10; /* Ensure buttons are on top */
    }
    
    .chngng {
        transition: transform 0.5s ease;
    }
    
    /* Custom range styling with both standard and vendor prefixes */
    input[type=range].range {
        -webkit-appearance: none;
        appearance: none; /* Standard property alongside vendor prefix */
        height: 0.5rem;
        background: #fec7e1; /* Amber 100 */
        border-radius: 8px;
    }
    
    input[type=range].range::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none; /* Standard property alongside vendor prefix */
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: #f59e0b; /* Amber 500 */
        cursor: pointer;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
    }
    
    input[type=range].range::-moz-range-thumb {
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: #f59e0b; /* Amber 500 */
        cursor: pointer;
        border: none;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
    }
</style>