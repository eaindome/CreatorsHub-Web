<script lang="ts">
  import { onMount } from 'svelte';
  import MediaCard from '$lib/components/MediaCard.svelte';
  import SearchBar from '$lib/components/SearchBar.svelte';
  import FilterPanel from '$lib/components/FilterPanel.svelte';
  import NavigationBar from '$lib/components/NavigationBar.svelte';
  import { browser } from '$app/environment';
  import { fade, fly } from 'svelte/transition';

  // State management
  let mediaItems: MediaItem[] = [];
  let isLoading = true;
  let activeFilters: string[] = [];
  let darkMode = false;
  let activeTab: 'all' | 'images' | 'videos' | 'audio' = 'all';
  let searchQuery = '';
  
  // Types
  interface MediaItem {
    id: string;
    type: 'image' | 'video' | 'audio';
    url: string;
    thumbnailUrl: string;
    creator: {
      id: string;
      username: string;
      avatarUrl: string;
    },
    tags: string[];
    liked: boolean;
    bookmarked: boolean;
    likes: number;
  }

  // Mock data for demonstration - would normally come from API
  const mockMediaItems: MediaItem[] = [
    {
      id: '1',
      type: 'image',
      url: '/images/sample1.jpg',
      thumbnailUrl: '/images/sample1_thumb.jpg',
      creator: {
        id: 'user1',
        username: 'artexplorer',
        avatarUrl: '/images/avatars/user1.jpg'
      },
      tags: ['photographer', 'landscape'],
      liked: false,
      bookmarked: true,
      likes: 42
    },
    {
      id: '2',
      type: 'video',
      url: '/videos/sample1.mp4',
      thumbnailUrl: '/images/video1_thumb.jpg',
      creator: {
        id: 'user2',
        username: 'filmcreator',
        avatarUrl: '/images/avatars/user2.jpg'
      },
      tags: ['filmmaker', 'documentary'],
      liked: true,
      bookmarked: false,
      likes: 78
    },
    {
      id: '3',
      type: 'audio',
      url: '/audio/sample1.mp3',
      thumbnailUrl: '/images/audio1_thumb.jpg',
      creator: {
        id: 'user3',
        username: 'soundartist',
        avatarUrl: '/images/avatars/user3.jpg'
      },
      tags: ['musician', 'electronic'],
      liked: false,
      bookmarked: false,
      likes: 21
    },
    {
      id: '4',
      type: 'image',
      url: '/images/sample2.jpg',
      thumbnailUrl: '/images/sample2_thumb.jpg',
      creator: {
        id: 'user4',
        username: 'visualpoet',
        avatarUrl: '/images/avatars/user4.jpg'
      },
      tags: ['photographer', 'portrait'],
      liked: false,
      bookmarked: false,
      likes: 56
    },
    {
      id: '5',
      type: 'image',
      url: '/images/sample3.jpg',
      thumbnailUrl: '/images/sample3_thumb.jpg',
      creator: {
        id: 'user5',
        username: 'colormaster',
        avatarUrl: '/images/avatars/user5.jpg'
      },
      tags: ['painter', 'abstract'],
      liked: false,
      bookmarked: false,
      likes: 33
    },
    {
      id: '6',
      type: 'video',
      url: '/videos/sample2.mp4',
      thumbnailUrl: '/images/video2_thumb.jpg',
      creator: {
        id: 'user6',
        username: 'motionartist',
        avatarUrl: '/images/avatars/user6.jpg'
      },
      tags: ['animator', '3d'],
      liked: false,
      bookmarked: true,
      likes: 91
    }
  ];

  // Available filter tags
  const availableTags = [
    'photographer', 'filmmaker', 'musician', 
    'painter', 'animator', 'poet',
    'landscape', 'portrait', 'abstract', 
    'documentary', 'electronic', '3d'
  ];

  // Stats for dashboard
  const creatorStats = {
    totalCreators: 6,
    totalContent: mockMediaItems.length,
    topCategory: 'image'
  };

  // Handle search
  function handleSearch(event: CustomEvent<string>) {
    searchQuery = event.detail.toLowerCase();
    applyFilters();
  }

  // Handle filter selection
  function handleFilterChange(event: CustomEvent<string[]>) {
    activeFilters = event.detail;
    applyFilters();
  }

  // Apply all filters and search
  function applyFilters() {
    let filteredItems = [...mockMediaItems];
    
    // Apply search query
    if (searchQuery) {
      filteredItems = filteredItems.filter(item => 
        item.creator.username.toLowerCase().includes(searchQuery) || 
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery))
      );
    }
    
    // Apply tag filters
    if (activeFilters.length > 0) {
      filteredItems = filteredItems.filter(item => 
        item.tags.some(tag => activeFilters.includes(tag))
      );
    }
    
    // Apply type filter (tab)
    if (activeTab !== 'all') {
      filteredItems = filteredItems.filter(item => item.type === activeTab);
    }
    
    mediaItems = filteredItems;
  }

  // Set active tab
  function setActiveTab(tab: 'all' | 'images' | 'videos' | 'audio') {
    activeTab = tab;
    applyFilters();
  }

  // Toggle like on media item
  function toggleLike(id: string) {
    mediaItems = mediaItems.map(item => {
      if (item.id === id) {
        const newLikedState = !item.liked;
        return {
          ...item,
          liked: newLikedState,
          likes: newLikedState ? item.likes + 1 : item.likes - 1
        };
      }
      return item;
    });
  }

  // Toggle bookmark on media item
  function toggleBookmark(id: string) {
    mediaItems = mediaItems.map(item => {
      if (item.id === id) {
        return { ...item, bookmarked: !item.bookmarked };
      }
      return item;
    });
  }

  // Handle load more button
  function loadMore() {
    // In a real app, this would fetch more items from the API
    // For now, we'll just duplicate the existing items with new IDs
    const newItems = mediaItems.slice(0, 3).map(item => ({
      ...item,
      id: `new-${item.id}-${Date.now()}`
    }));
    mediaItems = [...mediaItems, ...newItems];
  }

  // Toggle dark mode
  function toggleDarkMode() {
    darkMode = !darkMode;
    if (browser) {
      document.documentElement.classList.toggle('dark', darkMode);
    }
  }

  onMount(() => {
    // Check user preference for dark mode
    if (browser) {
      darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', darkMode);
    }
    
    // Initialize media items with a slight delay to show loading animation
    setTimeout(() => {
      mediaItems = [...mockMediaItems];
      isLoading = false;
    }, 800);
  });
</script>

<svelte:head>
  <title>CreatorsHub - Discover Creative Work</title>
  <meta name="description" content="Discover and connect with creative work from photographers, filmmakers, musicians and more." />
</svelte:head>

<div class="min-h-screen transition-colors duration-300">
  <!-- Navigation -->
  <NavigationBar {darkMode} on:toggleTheme={toggleDarkMode} />

  <!-- Hero Section -->
  <div class="bg-gradient-to-r from-[#4ECDC4] to-[#FF6B6B] py-12 dark:from-[#3AA8A0] dark:to-[#FF8787]">
    <div class="container mx-auto px-4">
      <div class="flex flex-col items-center text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4" in:fly={{ y: -20, duration: 500 }}>
          Discover Creative Excellence
        </h1>
        <p class="text-lg text-white/90 max-w-2xl mb-8" in:fly={{ y: -10, duration: 500, delay: 200 }}>
          Connect with inspiring creators and explore a world of curated content across photography, film, music, and more.
        </p>
        
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mb-8">
          {#each Object.entries(creatorStats) as [key, value], i}
            <div 
              class="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white" 
              in:fly={{ y: 20, duration: 300, delay: 300 + i * 100 }}
            >
              <div class="text-3xl font-bold">{value}</div>
              <div class="text-white/80 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <main class="container mx-auto px-4 py-8">
    <!-- Search and Filter Section -->
    <div class="mb-8 bg-white dark:bg-[#2D2D2D] rounded-xl p-6 shadow-sm">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Find Creative Work</h2>
        <div class="w-full md:w-1/2 lg:w-2/5">
          <SearchBar on:search={handleSearch} />
        </div>
      </div>
      
      <!-- Content Type Tabs -->
      <div class="flex flex-wrap gap-2 mb-4 border-b border-[#E0E0E0] dark:border-[#444444] pb-4">
        {#each [
          { id: 'all', label: 'All Content' },
          { id: 'images', label: 'Images' },
          { id: 'videos', label: 'Videos' },
          { id: 'audio', label: 'Audio' }
        ] as tab}
          <button 
            class="px-4 py-2 rounded-lg transition-colors duration-200 font-medium 
            {activeTab === tab.id ? 
              'bg-[#FF6B6B] text-white' : 
              'bg-[#E0E0E0]/50 dark:bg-[#444444] text-[#666666] dark:text-[#AAAAAA] hover:bg-[#E0E0E0] dark:hover:bg-[#555555]'}"
            on:click={() => setActiveTab(tab.id as any)}
          >
            {tab.label}
          </button>
        {/each}
      </div>
      
      <FilterPanel 
        availableTags={availableTags}
        activeFilters={activeFilters}
        on:filterChange={handleFilterChange}
      />
    </div>

    <!-- Featured Creators Section -->
    {#if !isLoading && !searchQuery && activeFilters.length === 0 && activeTab === 'all'}
    <div class="mb-12 bg-gradient-to-r from-[#F9F9F9] to-[#F0F0F0] dark:from-[#2A2A2A] dark:to-[#252525] p-8 rounded-xl">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-[#333333] dark:text-[#E6E6E6] flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-[#FF6B6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Featured Creators
        </h2>
        <div class="flex gap-2">
          <button class="p-2 rounded-full bg-white dark:bg-[#3D3D3D] shadow-sm hover:bg-[#F5F5F5] dark:hover:bg-[#444444] transition-colors" aria-label="Previous">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#555555] dark:text-[#AAAAAA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button class="p-2 rounded-full bg-white dark:bg-[#3D3D3D] shadow-sm hover:bg-[#F5F5F5] dark:hover:bg-[#444444] transition-colors" aria-label="Next">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#555555] dark:text-[#AAAAAA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div class="overflow-x-auto pb-4">
        <div class="flex gap-6" style="min-width: min-content;">
          {#each mockMediaItems.map(item => item.creator).filter((creator, index, self) => 
            index === self.findIndex(c => c.id === creator.id)
          ).slice(0, 6) as creator, i}
            <div 
              class="flex flex-col items-center p-6 bg-white dark:bg-[#2D2D2D] rounded-xl hover:shadow-md transition-all duration-300 border border-[#EEEEEE] dark:border-[#333333] min-w-[180px]"
              in:fade={{ delay: 200 + i * 100, duration: 300 }}
            >
              <div class="relative">
                <div class="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-[#4ECDC4] shadow-lg">
                  <img src={creator.avatarUrl} alt={creator.username} class="w-full h-full object-cover" />
                </div>
                <div class="absolute bottom-0 right-0 bg-[#FF6B6B] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md">
                  <span class="text-xs font-medium">{(i + 1) * 3}</span>
                </div>
              </div>
              <div class="text-center">
                <h3 class="font-semibold text-[#333333] dark:text-[#E6E6E6] text-lg">{creator.username}</h3>
                <p class="text-xs text-[#777777] dark:text-[#AAAAAA] mb-3">
                  {creator.id === 'user1' || creator.id === 'user4' ? 'Photographer' : 
                  creator.id === 'user2' || creator.id === 'user6' ? 'Filmmaker' : 
                  creator.id === 'user3' ? 'Sound Artist' : 'Visual Artist'}
                </p>
                <button class="px-5 py-2 bg-[#4ECDC4]/10 text-[#4ECDC4] rounded-full hover:bg-[#4ECDC4]/20 transition-colors text-sm font-medium">
                  Follow
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>
      
      <div class="flex justify-center mt-6">
        <div class="flex gap-1">
          {#each Array(3) as _, i}
            <button class="w-2 h-2 rounded-full {i === 0 ? 'bg-[#FF6B6B]' : 'bg-[#DDDDDD] dark:bg-[#444444]'}" aria-label="Pagination dot {i + 1}"></button>
          {/each}
        </div>
      </div>
    </div>
    {/if}

    <!-- Media Content Grid -->
    <div>
      <h2 class="text-2xl font-semibold mb-6 text-[#333333] dark:text-[#E6E6E6] flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-[#FF6B6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {activeTab === 'all' ? 'Explore Creative Work' : 
          activeTab === 'images' ? 'Photography & Art' : 
          activeTab === 'videos' ? 'Films & Videos' : 'Audio & Music'}
      </h2>

      {#if isLoading}
        <div class="flex justify-center items-center h-64">
          <div class="loader h-12 w-12 rounded-full border-4 border-t-[#FF6B6B] border-r-[#4ECDC4] border-b-[#FFC107] border-l-[#E0E0E0]"></div>
        </div>
      {:else if mediaItems.length === 0}
        <div class="flex flex-col items-center justify-center h-64 text-center bg-white dark:bg-[#2D2D2D] rounded-xl p-8">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-[#E0E0E0] dark:text-[#444444] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-[#333333] dark:text-[#E6E6E6] text-xl mb-4">No creative work found</p>
          <p class="text-[#666666] dark:text-[#AAAAAA] mb-6">Try adjusting your search or filters</p>
          <button 
            on:click={() => {
              searchQuery = '';
              activeFilters = [];
              activeTab = 'all';
              applyFilters();
            }}
            class="btn-secondary"
          >
            Clear All Filters
          </button>
        </div>
      {:else}
        <div in:fade>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {#each mediaItems as item, i (item.id)}
              <div in:fade={{ delay: 100 + (i % 4) * 100, duration: 300 }}>
                <MediaCard 
                  media={item}
                  on:like={() => toggleLike(item.id)} 
                  on:bookmark={() => toggleBookmark(item.id)}
                />
              </div>
            {/each}
          </div>
        </div>

        <!-- Load More Button -->
        <div class="flex justify-center mt-10 mb-8">
          <button 
            on:click={loadMore}
            class="btn-primary px-8 py-3 flex items-center"
          >
            <span>Load More</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      {/if}
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-[#333333] dark:bg-[#1A1A1A] text-white py-8 mt-12">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="mb-6 md:mb-0">
          <h2 class="text-2xl font-bold text-[#FF6B6B]">CreatorsHub</h2>
          <p class="text-[#AAAAAA] mt-2">Discover and connect with creative minds</p>
        </div>
        <div class="flex gap-6">
          <a href="#" class="hover:text-[#4ECDC4] transition-colors">About</a>
          <a href="#" class="hover:text-[#4ECDC4] transition-colors">Creators</a>
          <a href="#" class="hover:text-[#4ECDC4] transition-colors">FAQs</a>
          <a href="#" class="hover:text-[#4ECDC4] transition-colors">Contact</a>
        </div>
      </div>
      <div class="border-t border-[#444444] mt-6 pt-6 text-center text-[#AAAAAA]">
        <p>&copy; {new Date().getFullYear()} CreatorsHub. All rights reserved.</p>
      </div>
    </div>
  </footer>
</div>

<style>
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .loader {
    animation: spin 1s linear infinite;
  }
</style>