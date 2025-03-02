<!-- src/lib/components/Carousel3D.svelte -->
<script lang="ts">
    import { onMount } from "svelte";
    
    // Props
    export let items: string[];
    export let selectedItem: number = 0;
    export let moveForward: () => void;
    
    const perspectiveFactor: number = 2;
    const translationFactor: number = 1.1;
    const carouselArcDeg: number = 90;
    
    let carousel3dLen: number = items.length;
    let carouselStepDeg = carouselArcDeg / (carousel3dLen > 1 ? carousel3dLen - 1 : carousel3dLen);
    
    let carouselClientWidth = 0;
    let item3dtranslation = 0;
    let currdeg = 0;
    
    onMount(() => {
        selectedItem = parseInt(((carousel3dLen - 1) / 2).toFixed(0));
        updateCarouselValues();
    });
    
    // Create a reactive function to update values when selectedItem changes
    $: {
        selectedItem;
        updateCarouselValues();
    }
    
    function updateCarouselValues() {
        item3dtranslation = 0.5 * carouselClientWidth / Math.tan((0.5 * carouselStepDeg) * (Math.PI / 180));
        currdeg = selectedItem * carouselStepDeg;
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
                    <button on:click={() => { selectedItem = d }}
                        class="absolute preserve3d flex items-center justify-center aspect-square"
                        style="transform: rotateY({d * carouselStepDeg}deg) translateZ({(selectedItem === d ? translationFactor : 1) * item3dtranslation}px);">
                        
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
            on:click={moveForward}
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