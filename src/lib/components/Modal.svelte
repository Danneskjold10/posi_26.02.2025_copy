<!-- src/lib/components/Modal.svelte -->
<script lang="ts">
  import { browser } from '$app/environment';
  
  let modalContainer: HTMLDivElement | null = null;
  
  // Use $effect instead of onMount and onDestroy
  $effect(() => {
      // Only run in the browser
      if (!browser || !modalContainer) return;
      
      // Append the modal container to the body
      document.body.appendChild(modalContainer);
      
      // Lock scrolling
      document.body.style.overflow = 'hidden';
      
      // Cleanup function runs automatically when component is destroyed
      return () => {
          if (document.body.contains(modalContainer)) {
              document.body.removeChild(modalContainer);
          }
          document.body.style.overflow = '';
      };
  });
</script>

<!-- The container that will be moved to the body -->
<div bind:this={modalContainer} class="modal-portal">
  <slot />
</div>

<style>
  /* Styles will be inherited when used */
  .modal-portal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
  }
</style>