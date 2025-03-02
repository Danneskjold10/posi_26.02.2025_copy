<!-- src/lib/components/DiningOption.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher<{
    select: { option: 'dine-in' | 'to-go' }
  }>();
  
  function selectOption(option: 'dine-in' | 'to-go'): void {
    dispatch('select', { option });
  }

  let currentLanguage = 'EN';
  
  function setLanguage(lang: string): void {
    switch(lang) {
      case 'English':
        currentLanguage = 'EN';
        break;
      case 'Français':
        currentLanguage = 'FR';
        break;
      case 'Deutsch':
        currentLanguage = 'DE';
        break;
      case 'Türkçe':
        currentLanguage = 'TR';
        break;
      case 'Español':
        currentLanguage = 'ES';
        break;
    }
  }
</script>

<div class="flex flex-col items-center justify-between min-h-screen bg-white">
  <!-- Header with time and language selector -->
  <div class="w-full flex justify-between items-center px-4 py-2 text-orange-500">
    <div class="text-sm">02:00 pm</div>
    <div class="relative group">
      <button class="text-sm flex items-center">
        {currentLanguage} <span class="ml-1">▼</span>
      </button>
      <div class="absolute right-0 mt-1 w-32 bg-white shadow-lg rounded-md hidden group-hover:block z-20">
        <ul class="py-1">
          <li><button on:click={() => setLanguage('English')} class="w-full text-left px-4 py-2 hover:bg-orange-100 text-sm">English</button></li>
          <li><button on:click={() => setLanguage('Français')} class="w-full text-left px-4 py-2 hover:bg-orange-100 text-sm">Français</button></li>
          <li><button on:click={() => setLanguage('Deutsch')} class="w-full text-left px-4 py-2 hover:bg-orange-100 text-sm">Deutsch</button></li>
          <li><button on:click={() => setLanguage('Türkçe')} class="w-full text-left px-4 py-2 hover:bg-orange-100 text-sm">Türkçe</button></li>
          <li><button on:click={() => setLanguage('Español')} class="w-full text-left px-4 py-2 hover:bg-orange-100 text-sm">Español</button></li>
        </ul>
      </div>
    </div>
  </div>
  
  <!-- Logo section -->
  <div class="flex flex-col items-center mt-4">
    <img src="/icons/burger logo1.svg" alt="Burger King" class="w-40 h-40" />
    <h1 class="text-2xl font-medium text-center mt-4 mb-8">What would you like to eat today?</h1>
  </div>
  
  <!-- Dining options -->
  <div class="grid grid-cols-2 gap-4 w-full px-4 max-w-md mx-auto">
    <button
      class="bg-orange-500 rounded-xl p-8 flex flex-col items-center justify-center h-64"
      on:click={() => selectOption('dine-in')}
      aria-label="Eat In option"
    >
      <div class="flex flex-col items-center">
        <img src="/icons/dine in5.svg" alt="Eat In" class="h-40 w-auto mb-6" />
        <p class="text-white font-medium text-xl">Eat In</p>
      </div>
    </button>
    
    <button
      class="bg-orange-50 rounded-xl p-8 flex flex-col items-center justify-center h-64"
      on:click={() => selectOption('to-go')}
      aria-label="Take Out option"
    >
      <div class="flex flex-col items-center">
        <img src="/icons/take away2.svg" alt="Take Out" class="h-40 w-auto mb-6" />
        <p class="text-gray-700 font-medium text-xl">Take Out</p>
      </div>
    </button>
  </div>
  
  <!-- Featured product image -->
  <div class="w-full mt-8 flex justify-center">
    <div class="relative w-full max-w-lg">
      <div class="bg-orange-500 rounded-t-3xl h-16 w-full absolute bottom-0"></div>
      <img 
        src="/images/burger combo.png" 
        alt="Featured burger with fries and drink" 
        class="w-full max-w-lg relative z-10"
      />
    </div>
  </div>
</div>