<script lang="ts">
  import { createEventDispatcher, tick } from 'svelte';
  import { onMount } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  // Props with defaults
  export let placeholder = "Search for poets, filmmakers, or tags...";
  export let minCharsForSuggestions = 1;
  export let maxSuggestions = 5;
  export let loadingDelay = 200; // ms to show loading state
  
  // State variables
  let searchTerm = '';
  let isFocused = false;
  let isLoading = false;
  let suggestions: string[] = [];
  let showSuggestions = false;
  let selectedIndex = -1;
  let inputElement: HTMLInputElement;
  let searchHistory: string[] = [];
  
  // Mock suggestions data - would normally come from an API
  const allSuggestions = [
    'photographer', 'filmmaker', 'musician', 
    'painter', 'animator', 'poet',
    'portrait', 'landscape', 'abstract',
    'documentary', 'electronic', '3d',
    'artexplorer', 'filmcreator', 'soundartist',
    'visualpoet', 'colormaster'
  ];
  
  // Load search history from localStorage
  onMount(() => {
    try {
      const storedHistory = localStorage.getItem('searchHistory');
      if (storedHistory) {
        searchHistory = JSON.parse(storedHistory).slice(0, 5);
      }
    } catch (e) {
      console.error('Failed to load search history:', e);
    }
    
    // Close suggestions on click outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-container')) {
        showSuggestions = false;
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
  
  async function handleInput() {
    selectedIndex = -1;
    
    if (searchTerm.trim().length >= minCharsForSuggestions) {
      // Show loading indicator after short delay
      const loadingTimeout = setTimeout(() => {
        isLoading = true; 
      }, loadingDelay);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      clearTimeout(loadingTimeout);
      
      // Filter suggestions based on input
      suggestions = [...new Set([
        // Start with exact matches
        ...allSuggestions.filter(s => 
          s.toLowerCase().startsWith(searchTerm.toLowerCase())
        ),
        // Then include partial matches
        ...allSuggestions.filter(s => 
          !s.toLowerCase().startsWith(searchTerm.toLowerCase()) && 
          s.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        // Include history matches if applicable
        ...searchHistory.filter(s => 
          s.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !allSuggestions.some(suggestion => suggestion.toLowerCase() === s.toLowerCase())
        )
      ])].slice(0, maxSuggestions);
      
      showSuggestions = suggestions.length > 0;
      isLoading = false;
    } else {
      showSuggestions = false;
      isLoading = false;
    }
    
    // Dispatch search event with current search term
    dispatch('search', { term: searchTerm, immediate: false });
  }
  
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      showSuggestions = false;
      inputElement.blur();
    } else if (event.key === 'ArrowDown' && showSuggestions) {
      event.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
    } else if (event.key === 'ArrowUp' && showSuggestions) {
      event.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, -1);
    } else if (event.key === 'Enter') {
      if (showSuggestions && selectedIndex >= 0) {
        selectSuggestion(suggestions[selectedIndex]);
      } else if (searchTerm.trim() !== '') {
        submitSearch();
      }
    }
  }
  
  function selectSuggestion(suggestion: string) {
    searchTerm = suggestion;
    showSuggestions = false;
    addToHistory(suggestion);
    submitSearch();
    
    // Focus back on input after selecting
    tick().then(() => {
      inputElement.focus();
    });
  }
  
  function submitSearch() {
    if (searchTerm.trim() !== '') {
      addToHistory(searchTerm);
      dispatch('search', { term: searchTerm, immediate: true });
      showSuggestions = false;
    }
  }
  
  function clearSearch() {
    searchTerm = '';
    showSuggestions = false;
    selectedIndex = -1;
    dispatch('clear');
    
    // Focus back on input after clearing
    tick().then(() => {
      inputElement.focus();
    });
  }
  
  function handleFocus() {
    isFocused = true;
    if (searchTerm.trim().length >= minCharsForSuggestions && suggestions.length > 0) {
      showSuggestions = true;
    } else if (searchTerm.trim() === '' && searchHistory.length > 0) {
      // Show recent searches when focusing on empty input
      suggestions = searchHistory.slice(0, maxSuggestions);
      showSuggestions = true;
    }
  }
  
  function handleBlur() {
    // Delay hiding suggestions to allow for click on suggestion
    setTimeout(() => {
      isFocused = false;
      showSuggestions = false;
    }, 200);
  }
  
  function addToHistory(term: string) {
    const trimmedTerm = term.trim();
    if (trimmedTerm) {
      // Remove if exists and add to front
      searchHistory = [
        trimmedTerm,
        ...searchHistory.filter(item => item.toLowerCase() !== trimmedTerm.toLowerCase())
      ].slice(0, 5);
      
      try {
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
      } catch (e) {
        console.error('Failed to save search history:', e);
      }
    }
  }
  
  function clearHistory() {
    searchHistory = [];
    try {
      localStorage.removeItem('searchHistory');
    } catch (e) {
      console.error('Failed to clear search history:', e);
    }
    
    if (searchTerm.trim() === '') {
      showSuggestions = false;
    }
  }
  
  function highlightMatch(text: string) {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<span class="text-[#FF6B6B] font-medium">$1</span>');
  }
</script>

<div 
  class="search-container relative w-full max-w-md mx-auto" 
  role="search"
  aria-label="Site search"
>
  <div class="relative">
    <input
      type="search"
      bind:this={inputElement}
      bind:value={searchTerm}
      on:input={handleInput}
      on:focus={handleFocus}
      on:blur={handleBlur}
      on:keydown={handleKeyDown}
      placeholder={placeholder}
      autocomplete="off"
      aria-label="Search"
      aria-autocomplete="list"
      aria-controls={showSuggestions ? "search-suggestions" : undefined}
      aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
      class="w-full px-4 py-3 pl-10 rounded-lg bg-white dark:bg-[#2D2D2D] text-[#333333] dark:text-[#E6E6E6] border border-[#E0E0E0] dark:border-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-md {isFocused ? 'ring-2 ring-[#FF6B6B]' : ''}"
    />
    
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-5 w-5 {isFocused ? 'text-[#FF6B6B]' : 'text-gray-400'} transition-colors duration-200" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    
    {#if isLoading}
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-[#FF6B6B]"></div>
      </div>
    {:else if searchTerm}
      <button 
        on:click={clearSearch}
        class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer focus:outline-none"
        aria-label="Clear search input"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-5 w-5 text-gray-400 hover:text-[#FF6B6B] transition-colors duration-200" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    {:else}
      <!-- Submit button for empty searches (shows in mobile) -->
      <button 
        on:click={submitSearch}
        class="absolute inset-y-0 right-0 pr-3 sm:hidden flex items-center cursor-pointer focus:outline-none"
        aria-label="Submit search"
        disabled={!searchTerm.trim()}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-5 w-5 {searchTerm.trim() ? 'text-[#FF6B6B]' : 'text-gray-400'}" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    {/if}
  </div>
  
  {#if showSuggestions}
    <div 
      id="search-suggestions"
      class="absolute z-20 mt-1 w-full bg-white dark:bg-[#2D2D2D] border border-[#E0E0E0] dark:border-[#3D3D3D] rounded-lg shadow-lg overflow-hidden transition-opacity duration-200 opacity-100"
      role="listbox"
    >
      {#if searchTerm.trim() === '' && searchHistory.length > 0}
        <div class="flex justify-between items-center py-2 px-3 bg-gray-100 dark:bg-[#333333] text-sm">
          <span class="font-medium text-gray-500 dark:text-gray-300">Recent Searches</span>
          <button 
            on:click={clearHistory}
            class="text-xs text-[#FF6B6B] hover:text-[#E05555] focus:outline-none transition-colors duration-200"
            aria-label="Clear search history"
          >
            Clear All
          </button>
        </div>
      {/if}
      
      <ul class="max-h-60 overflow-y-auto">
        {#each suggestions as suggestion, i}
          <li>
            <button 
              id="suggestion-{i}"
              on:click={() => selectSuggestion(suggestion)}
              class="w-full text-left px-4 py-2 flex items-center cursor-pointer {selectedIndex === i ? 'bg-[#FFEFEF] dark:bg-[#3D3D3D]' : 'hover:bg-[#F5F5F5] dark:hover:bg-[#333333]'} text-[#333333] dark:text-[#E6E6E6] focus:outline-none transition-colors duration-150"
              role="option"
              aria-selected={selectedIndex === i}
            >
              {#if searchHistory.includes(suggestion) && searchTerm.trim() === ''}
                <!-- Recent search item -->
                <svg class="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {suggestion}
              {:else}
                <!-- Regular suggestion -->
                <svg class="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <!-- svelte-ignore html-no-root-svelte-component -->
                {@html highlightMatch(suggestion)}
              {/if}
            </button>
          </li>
        {/each}
      </ul>
      
      {#if suggestions.length > 0 && searchTerm.trim() !== ''}
        <div class="px-4 py-2 text-xs text-center text-gray-500 border-t border-gray-200 dark:border-[#3D3D3D]">
          Press <kbd class="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↑</kbd> <kbd class="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↓</kbd> to navigate, <kbd class="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Enter</kbd> to select
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  /* Smooth animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  :global(.dark) {
    color-scheme: dark;
  }
  
  /* Customizable scrollbar */
  ul::-webkit-scrollbar {
    width: 8px;
  }
  
  ul::-webkit-scrollbar-track {
    background: transparent;
  }
  
  ul::-webkit-scrollbar-thumb {
    background-color: #E0E0E0;
    border-radius: 20px;
  }
  
  :global(.dark) ul::-webkit-scrollbar-thumb {
    background-color: #3D3D3D;
  }
  
  /* Make suggestion list animation smooth */
  #search-suggestions {
    animation: fadeIn 0.2s ease-out;
  }
</style>