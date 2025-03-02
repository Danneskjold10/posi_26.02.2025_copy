<!-- src/routes/+layout.svelte -->
<script lang="ts">
    import "../app.css";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import { page } from '$app/stores';
    
    // Determine if we should show the header
    // Don't show header on the initial dining option selection page
    $: showHeader = $page.url.pathname !== '/';
  </script>
  
  <div class="flex flex-col min-h-screen">
    {#if showHeader}
      <Header />
    {/if}
    
    <main class="flex-grow">
      <slot />
    </main>
    
    <Footer />
  </div>