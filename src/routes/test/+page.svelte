<!-- src/routes/test/+page.svelte -->
<script>
    import { goto } from '$app/navigation';
    
    function goToHome() {
      goto('/');
    }
  </script>
  
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
    <h1 class="text-3xl font-bold mb-4">Test Page Works!</h1>
    <p class="mb-4">If you can see this, routing to simple pages is working.</p>
    
    <button 
      class="bg-blue-500 text-white px-4 py-2 rounded"
      on:click={goToHome}
    >
      Go Back Home
    </button>
  </div>