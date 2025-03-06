<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import DiningOption from '$lib/components/DiningOption.svelte';
  import { browser } from '$app/environment';
  
  // Define a type for the select event detail
  interface SelectEventDetail {
      option: 'dine-in' | 'to-go';
  }
  
  function handleOptionSelect(event: CustomEvent<SelectEventDetail>): void {
      const { option } = event.detail;
      
      // Save the dining option to local storage
      if (browser) {
          localStorage.setItem('diningOption', option);
      }
      
      // Navigate to the menu page
      goto('/menu');
  }
</script>

<div class="min-h-screen flex flex-col">
  <!-- Top decorative pattern (optional) -->
  <div class="h-4 bg-gradient-to-r from-primary to-secondary"></div>
  
  <div class="container mx-auto px-4 py-8 flex-grow flex flex-col justify-between">
      <DiningOption on:select={handleOptionSelect} />
      
      <div class="mt-10 flex justify-center">
          <div class="max-w-lg text-center p-6 bg-base-200 rounded-lg shadow-md">
              <h2 class="text-2xl font-semibold mb-3">Our Commitment</h2>
              <p class="text-lg">
                  At Burger Express, we're committed to serving fresh, high-quality food with fast and friendly service.
              </p>
          </div>
      </div>
  </div>
  
  <!-- Bottom decorative element -->
  <div class="h-4 bg-gradient-to-r from-secondary to-primary mt-auto"></div>
</div>