<!-- src/lib/components/Footer.svelte -->
<script lang="ts">
  // Get current year for copyright
  const currentYear = $derived(new Date().getFullYear());
</script>

<footer class="bg-neutral text-neutral-content p-4 mt-auto">
  <div class="container mx-auto text-center">
      <p>© {currentYear} Burger Express. All rights reserved.</p>
      <div class="mt-2">
          <a href="/terms" class="link link-hover mx-2">Terms of Service</a>
          <a href="/privacy" class="link link-hover mx-2">Privacy Policy</a>
          <a href="/contact" class="link link-hover mx-2">Contact Us</a>
      </div>
  </div>
</footer>