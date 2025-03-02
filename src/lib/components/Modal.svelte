<!-- src/lib/components/Modal.svelte -->
<!-- This is a new component for portaling the modal to the body -->
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    
    let modalContainer: HTMLDivElement;
    
    onMount(() => {
      // Append the modal container to the body
      document.body.appendChild(modalContainer);
      
      // Lock scrolling
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Clean up on component destroy
        if (document.body.contains(modalContainer)) {
          document.body.removeChild(modalContainer);
        }
        document.body.style.overflow = '';
      };
    });
    
    onDestroy(() => {
      // Extra safety to ensure cleanup
      if (document.body.contains(modalContainer)) {
        document.body.removeChild(modalContainer);
      }
      document.body.style.overflow = '';
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