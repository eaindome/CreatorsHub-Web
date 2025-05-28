<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    export let availableTags: string[] = [];
    export let activeFilters: string[] = [];
    
    const dispatch = createEventDispatcher();
    let isExpanded = false;
    
    function toggleTag(tag: string) {
      if (activeFilters.includes(tag)) {
        // Remove tag if already active
        activeFilters = activeFilters.filter(t => t !== tag);
      } else {
        // Add tag if not active
        activeFilters = [...activeFilters, tag];
      }
      
      dispatch('filterChange', activeFilters);
    }
    
    function clearFilters() {
      activeFilters = [];
      dispatch('filterChange', activeFilters);
    }
    
    function toggleExpand() {
      isExpanded = !isExpanded;
    }
  </script>
  
  <div class="filter-panel">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-[#333333] dark:text-[#E6E6E6] font-medium">
        Filters
        {#if activeFilters.length > 0}
          <span class="ml-2 text-[#4ECDC4] text-sm">{activeFilters.length} active</span>
        {/if}
      </h3>
      
      <div class="flex items-center space-x-2">
        {#if activeFilters.length > 0}
          <button 
            on:click={clearFilters}
            class="text-[#FF6B6B] text-sm hover:underline"
          >
            Clear all
          </button>
        {/if}
        
        <button 
          on:click={toggleExpand}
          class="p-1 hover:bg-[#E0E0E0] dark:hover:bg-[#3D3D3D] rounded transition-colors duration-200"
        >
          {#if isExpanded}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#333333] dark:text-[#E6E6E6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#333333] dark:text-[#E6E6E6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          {/if}
        </button>
      </div>
    </div>
    
    <!-- Always show active filters -->
    {#if activeFilters.length > 0}
      <div class="flex flex-wrap gap-2 mb-2">
        {#each activeFilters as tag}
          <button 
            on:click={() => toggleTag(tag)}
            class="px-3 py-1 text-sm bg-[#FF6B6B] hover:bg-[#FF8787] text-white rounded-full flex items-center transition-colors duration-200"
          >
            <span>{tag}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        {/each}
      </div>
    {/if}
    
    <!-- Filter tags section (expanded/collapsed) -->
    {#if isExpanded || activeFilters.length === 0}
      <div class="bg-white dark:bg-[#2D2D2D] p-3 rounded-lg border border-[#E0E0E0] dark:border-[#3D3D3D] transition-all duration-300">
        <div class="flex flex-wrap gap-2">
          {#each availableTags as tag}
            {@const isActive = activeFilters.includes(tag)}
            <button 
              on:click={() => toggleTag(tag)}
              class="{isActive ? 'bg-[#4ECDC4] text-white' : 'bg-[#E0E0E0] dark:bg-[#3D3D3D] text-[#333333] dark:text-[#E6E6E6]'} px-3 py-1 text-sm rounded-full hover:opacity-90 transition-all duration-200"
            >
              {tag}
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>