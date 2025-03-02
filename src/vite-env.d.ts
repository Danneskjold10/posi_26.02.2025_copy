/// <reference types="svelte" />
/// <reference types="vite/client" />

// Declare Svelte file types
declare module '*.svelte' {
    import type { ComponentType } from 'svelte';
    const component: ComponentType;
    export default component;
  }