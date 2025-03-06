<!-- src/lib/components/Carousel3D.svelte -->
<script lang="ts">
    import { calculateCarouselTranslation, getCarouselItemTransform } from '../utils/animation-utils';
    
    // Props
    let {
        items = [],
        selectedItem = 0,
        moveForward
    }: {
        items: string[];
        selectedItem?: number;
        moveForward: () => void;
    } = $props();
    
    // Constants for carousel parameters
    const perspectiveFactor: number = 2;
    const translationFactor: number = 1.1;
    const carouselArcDeg: number = 90;
    
    // State
    let carouselClientWidth = $state(0);
    let item3dtranslation = $state(0);
    let currdeg = $state(0);
    
    // Derived values
    const carousel3dLen = $derived(items.length);
    const carouselStepDeg = $derived(
        carouselArcDeg / (carousel3dLen > 1 ? carousel3dLen - 1 : carousel3dLen)
    );
    
    // Initialize with default values
    $effect(() => {
        selectedItem = parseInt(((carousel3dLen - 1) / 2).toFixed(0));
        updateCarouselValues();
    });
    
    // Update values when selection changes
    $effect(() => {
        if (selectedItem !== undefined) {
            updateCarouselValues();
        }
    });
    
    function updateCarouselValues(): void {
        item3dtranslation = calculateCarouselTranslation(carouselClientWidth, carouselStepDeg);
        currdeg = selectedItem * carouselStepDeg;
    }
    
    // Item selection handler
    function handleItemSelection(index: number): void {
        selectedItem = index;
    }
    
    // Create selection handler functions
    function createSelectionHandler(index: number): () => void {
        return function() {
            handleItemSelection(index);
        };
    }
</script>

<div class="h-full w-full relative justify-items-center content-center bg-pink-100 rounded-xl">
    <!-- Carousel container -->
    <div class="py-20 flex items-center justify-center">
        <div class="h-64 w-full relative preserve3d" 
             bind:clientWidth={carouselClientWidth} 
             style="perspective:{perspectiveFactor * carouselClientWidth}px;">
            <div class="w-full h-full absolute preserve3d chngng" 
                 style="transform:translateZ(-{translationFactor * item3dtranslation}px) rotateY(-{currdeg}deg);">
                {#each items as item, d}
                    <button onclick={createSelectionHandler(d)}
                        class="absolute preserve3d flex items-center justify-center aspect-square"
                        style="transform: {getCarouselItemTransform(d, carouselStepDeg, item3dtranslation, selectedItem === d, translationFactor)};">
                        
                        <div class="h-32 w-32 flex items-center justify-center text-xl font-semibold {selectedItem === d ? 'bg-green-600 text-white' : 'bg-pink-200/40 text-gray-600'} 
                              rounded-lg shadow-lg transform transition-all duration-300">
                            {item}
                        </div>
                    </button>
                {/each}
            </div>
        </div>
    </div>
    
    <!-- Carousel Navigation Controls -->
    <div class="absolute bottom-32 left-0 right-0 justify-self-center w-full flex justify-between px-4">
        <input class="range range-xs w-full" type="range" min="0" max="{carousel3dLen - 1}" step="1" bind:value={selectedItem} />
    </div>
    
    <!-- Size indicators at bottom -->
    <div class="absolute bottom-20 left-0 right-0 flex justify-between px-12 text-xs">
        {#each items as item, d}
            <span class="{selectedItem === d ? 'font-bold text-gray-700' : 'text-gray-500'}">{item}</span>
        {/each}
    </div>
    
    <!-- Forward Button -->
    <div class="absolute bottom-6 left-0 right-0 flex justify-center">
        <button 
            class="bg-green-600 text-white py-3 px-6 rounded-md flex items-center justify-center space-x-2 hover:bg-green-700 transition-colors"
            onclick={moveForward}
        >
            <span>Forward</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
        </button>
    </div>
    
    <!-- Step indicators at top -->
    <div class="absolute top-4 left-0 right-0 flex justify-center gap-2">
        {#each Array(4) as _, i}
            <div class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white">
                {i}
            </div>
        {/each}
    </div>
</div>

<style>
    .preserve3d {
        transform-style: preserve-3d;
    }
    
    /* Add transitions for smooth animations */
    .chngng {
        transition: transform 0.5s ease;
    }
    
    /* Override range slider styles */
    .range-xs {
        height: 0.5rem;
        background-color: #333;
    }
    
    input[type=range]::-webkit-slider-thumb {
        background: #4CAF50;
    }
</style>