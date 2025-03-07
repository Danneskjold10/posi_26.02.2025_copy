<!-- src/lib/components/IntensityBar.svelte -->
<script lang="ts">
    // Props
    export let selected: boolean = false;
    export let intensity: number = -1; // -1: not selected, 0: low, 1: medium, 2: high
    export let onIntensityChange: (level: number) => void;
    
    // Check for Enter or Space key for accessibility
    function handleKey(event: KeyboardEvent, level: number) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onIntensityChange(level);
      }
    }
  </script>
  
  <div class="flex space-x-1 transform rotate-180 cursor-pointer mt-2">
    <!-- Light level - Always green when selected -->
    <div
      class={`w-3 h-12 rounded-t-sm ${
        selected
          ? intensity >= 0
            ? 'bg-green-500'
            : 'bg-gray-400'
          : 'bg-gray-200'
      } transition-all hover:opacity-80`}
      tabindex="0"
      role="button"
      aria-label="Light intensity"
      onclick={() => onIntensityChange(0)}
      onkeydown={(event) => handleKey(event, 0)}
    ></div>
  
    <!-- Regular level - Yellow when regular or extra is selected -->
    <div
      class={`w-3 h-16 rounded-t-sm ${
        selected
          ? intensity >= 1
            ? 'bg-yellow-500'
            : 'bg-gray-400'
          : 'bg-gray-200'
      } transition-all hover:opacity-80`}
      tabindex="0"
      role="button"
      aria-label="Regular intensity"
      onclick={() => onIntensityChange(1)}
      onkeydown={(event) => handleKey(event, 1)}
    ></div>
  
    <!-- Extra level - Red only when extra is selected -->
    <div
      class={`w-3 h-20 rounded-t-sm ${
        selected
          ? intensity >= 2
            ? 'bg-red-500'
            : 'bg-gray-400'
          : 'bg-gray-200'
      } transition-all hover:opacity-80`}
      tabindex="0"
      role="button"
      aria-label="Extra intensity"
      onkeydown={(event) => handleKey(event, 2)}
      onclick={() => onIntensityChange(2)}
    ></div>
  </div>