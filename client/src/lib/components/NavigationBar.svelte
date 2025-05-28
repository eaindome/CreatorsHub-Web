<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  
  export let darkMode: boolean = false;
  let mobileMenuOpen: boolean = false;
  let isScrolled: boolean = false;
  
  const dispatch = createEventDispatcher();
  
  function toggleTheme() {
    dispatch('toggleTheme');
  }
  
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
  
  onMount(() => {
    const handleScroll = () => {
      isScrolled = window.scrollY > 10;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<nav class={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'} bg-[var(--off-white)] dark:bg-[var(--midnight-gray)]`}>
  <div class="container mx-auto px-4">
    <div class="flex justify-between items-center h-16">
      <!-- Logo -->
      <div class="flex items-center">
        <a href="/" class="flex items-center group" aria-label="CreatorsHub Home">
          <svg class="h-8 w-8 text-[var(--coral-glow)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
          <span class="ml-2 text-xl font-bold tracking-tight transition-colors duration-300 dark:text-[var(--soft-white)] text-[var(--charcoal)]">
            Creators<span class="text-[var(--coral-glow)]">Hub</span>
          </span>
        </a>
      </div>
      
      <!-- Main Navigation -->
      <div class="hidden md:flex items-center space-x-6">
        <a href="/" class="relative nav-link text-[var(--charcoal)] dark:text-[var(--soft-white)] hover:text-[var(--coral-glow)] dark:hover:text-[var(--coral-glow)] font-medium flex items-center py-5 px-2 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[var(--coral-glow)] after:transition-all hover:after:w-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
          </svg>
          Home
        </a>
        <a href="/explore" class="relative nav-link text-[var(--charcoal)] dark:text-[var(--soft-white)] hover:text-[var(--coral-glow)] dark:hover:text-[var(--coral-glow)] font-medium flex items-center py-5 px-2 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[var(--coral-glow)] after:transition-all hover:after:w-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Explore
        </a>
        <a href="/upload" class="relative nav-link text-[var(--charcoal)] dark:text-[var(--soft-white)] hover:text-[var(--coral-glow)] dark:hover:text-[var(--coral-glow)] font-medium flex items-center py-5 px-2 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[var(--coral-glow)] after:transition-all hover:after:w-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Upload
        </a>
      </div>
      
      <!-- Right side options -->
      <div class="flex items-center space-x-4">
        <!-- Theme Toggle -->
        <button 
          on:click={toggleTheme}
          class="p-2 rounded-full hover:bg-[var(--warm-gray)]/30 dark:hover:bg-[var(--midnight-gray)]/80 transition-colors duration-200 relative overflow-hidden"
          aria-label="Toggle dark mode"
        >
          <div class="relative z-10">
            {#if darkMode}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[var(--soft-white)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[var(--charcoal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            {/if}
          </div>
        </button>
        
        <!-- Profile -->
        <a href="/profile" class="group flex items-center">
          <div class="h-8 w-8 rounded-full bg-[var(--teal-spark)] ring-2 ring-transparent hover:ring-[var(--coral-glow)] transition-all duration-300 flex items-center justify-center text-white overflow-hidden group-hover:scale-110">
            <img src="/images/avatars/default.jpg" alt="Profile" class="h-full w-full object-cover" />
          </div>
        </a>
        
        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <button 
            on:click={toggleMobileMenu}
            class="p-2 rounded-md hover:bg-[var(--warm-gray)]/30 dark:hover:bg-[var(--midnight-gray)]/80 transition-colors duration-200" 
            aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            aria-expanded={mobileMenuOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[var(--charcoal)] dark:text-[var(--soft-white)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {#if mobileMenuOpen}
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              {:else}
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
              {/if}
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</nav>

<!-- Mobile Menu (toggle with animation) -->
<div 
  class="fixed top-16 left-0 right-0 z-40 bg-[var(--off-white)] dark:bg-[var(--midnight-gray)] shadow-lg transform transition-transform duration-300 ease-in-out {mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'} md:hidden"
  aria-hidden={!mobileMenuOpen}
>
  <div class="px-4 py-3 space-y-1">
    <a href="/" class="px-3 py-3 rounded-md text-base font-medium text-[var(--charcoal)] dark:text-[var(--soft-white)] hover:bg-[var(--warm-gray)]/30 dark:hover:bg-[var(--midnight-gray)]/80 transition-colors flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-[var(--coral-glow)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
      </svg>
      Home
    </a>
    <a href="/explore" class="px-3 py-3 rounded-md text-base font-medium text-[var(--charcoal)] dark:text-[var(--soft-white)] hover:bg-[var(--warm-gray)]/30 dark:hover:bg-[var(--midnight-gray)]/80 transition-colors flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-[var(--coral-glow)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      Explore
    </a>
    <a href="/upload" class="px-3 py-3 rounded-md text-base font-medium text-[var(--charcoal)] dark:text-[var(--soft-white)] hover:bg-[var(--warm-gray)]/30 dark:hover:bg-[var(--midnight-gray)]/80 transition-colors flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-[var(--coral-glow)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      Upload
    </a>
    <a href="/profile" class="px-3 py-3 rounded-md text-base font-medium text-[var(--charcoal)] dark:text-[var(--soft-white)] hover:bg-[var(--warm-gray)]/30 dark:hover:bg-[var(--midnight-gray)]/80 transition-colors flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-[var(--coral-glow)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      Profile
    </a>
  </div>
</div>

<!-- Spacer to prevent content from being hidden under the fixed navbar -->
<div class="h-16"></div>