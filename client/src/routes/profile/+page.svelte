<script lang="ts">
    import { profileService } from '$lib/services/profileService';
    import MediaCard from '$lib/components/MediaCard.svelte';
    import ThemeToggle from '$lib/components/ThemeToggle.svelte';
    import { page } from '$app/stores';
    import type { Profile } from '$lib/types/profile';
    
    export let data: { profile: Profile; error?: string };
    
    // Get profile data from the server load function
    let profile: Profile = data.profile;
    let error = data.error;
    let isLoading = !profile || Object.keys(profile).length === 0;
    let selectedTab = 'all';
    let filteredMedia = profile?.media || [];
    
    // Apply filters based on the selected tab
    $: {
      if (profile?.media) {
        if (selectedTab === 'all') {
          filteredMedia = profile.media;
        } else if (selectedTab === 'images') {
          filteredMedia = profile.media.filter(item => item.type === 'image');
        } else if (selectedTab === 'videos') {
          filteredMedia = profile.media.filter(item => item.type === 'video');
        } else if (selectedTab === 'audio') {
          filteredMedia = profile.media.filter(item => item.type === 'audio');
        }
      }
    }
    
    // Handle following/unfollowing
    async function toggleFollow() {
      if (profile.isFollowing) {
        const result = await profileService.unfollowUser(profile.username);
        if (result.success) {
          profile.isFollowing = false;
          profile.followers -= 1;
        }
      } else {
        const result = await profileService.followUser(profile.username);
        if (result.success) {
          profile.isFollowing = true;
          profile.followers += 1;
        }
      }
    }
    
    // Filter media by type or tag
    function filterMedia(tab: string) {
      selectedTab = tab;
    }
    
    // Helper function to get the appropriate accent color class
    function getAccentColorClass(type: 'bg' | 'text' | 'border') {
      switch (profile.accentColor) {
        case 'coral':
          return type === 'bg' ? 'bg-[#FF6B6B]' : type === 'text' ? 'text-[#FF6B6B]' : 'border-[#FF6B6B]';
        case 'teal':
          return type === 'bg' ? 'bg-[#4ECDC4]' : type === 'text' ? 'text-[#4ECDC4]' : 'border-[#4ECDC4]';
        case 'mustard':
          return type === 'bg' ? 'bg-[#FFC107]' : type === 'text' ? 'text-[#FFC107]' : 'border-[#FFC107]';
        default:
          return type === 'bg' ? 'bg-[#4ECDC4]' : type === 'text' ? 'text-[#4ECDC4]' : 'border-[#4ECDC4]';
      }
    }
    
    // Get media item type icon
    function getMediaTypeIcon(type: string) {
      switch (type) {
        case 'video':
          return 'i-carbon-play-filled';
        case 'audio':
          return 'i-carbon-music';
        default:
          return '';
      }
    }
  </script>
  
  <svelte:head>
    <title>{profile.displayName || 'Profile'} | CreatorsHub</title>
    <meta name="description" content="View {profile.displayName}'s creative portfolio on CreatorsHub" />
  </svelte:head>
  
  <main class="container mx-auto px-4 py-8 md:px-6">
    <!-- Theme Toggle Button - Fixed position -->
    <div class="fixed bottom-6 right-6 z-50">
      <ThemeToggle />
    </div>
    {#if isLoading}
      <div class="flex h-64 flex-col items-center justify-center space-y-4">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-[#4ECDC4] border-t-transparent"></div>
        <p class="text-[#333333] dark:text-[#E6E6E6]">Loading profile...</p>
      </div>
    {:else if error}
      <div class="flex h-64 flex-col items-center justify-center space-y-4 rounded-lg bg-red-50 p-8 text-center dark:bg-red-900/20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-xl font-medium text-red-700 dark:text-red-400">Error Loading Profile</h2>
        <p class="text-red-600 dark:text-red-300">{error}</p>
        <button 
          class="mt-2 rounded-lg bg-[#FF6B6B] px-4 py-2 font-medium text-white transition-colors hover:bg-[#FF8787]"
          on:click={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    {:else}
      <!-- Profile Header Section -->
      <div class="mb-8 overflow-hidden rounded-xl bg-white dark:bg-[#2D2D2D]">
        <!-- Accent Color Banner -->
        <div class="{getAccentColorClass('bg')} h-24 md:h-32"></div>
        
        <div class="px-6 pb-6">
          <!-- Profile Picture and Main Info -->
          <div class="flex flex-col items-center md:flex-row md:items-start">
            <!-- Profile Picture -->
            <div class="relative -mt-16 mb-4 h-32 w-32 md:mb-0">
              <img
                src={profile.profilePicture}
                alt={profile.displayName}
                class="h-full w-full rounded-full border-4 border-[#E0E0E0] object-cover dark:border-[#2D2D2D]"
              />
            </div>
            
            <!-- Profile Info and Actions -->
            <div class="flex flex-1 flex-col text-center md:ml-6 md:text-left">
              <h1 class="mb-1 text-2xl font-bold md:text-3xl">{profile.displayName}</h1>
              <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">@{profile.username}</p>
              <p class="mb-4 max-w-2xl">{profile.bio}</p>
              
              <!-- Tags Section -->
              <div class="mb-4 flex flex-wrap justify-center gap-2 md:justify-start">
                {#each profile.tags as tag}
                  <span class="tag-badge">#{tag}</span>
                {/each}
              </div>
              
              <!-- Stats and Action Buttons -->
              <div class="mt-2 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                <!-- Follower Stats -->
                <div class="flex gap-4 text-sm">
                  <button class="font-semibold hover:underline">
                    <span class="font-bold">{profile.followers}</span> Followers
                  </button>
                  <button class="font-semibold hover:underline">
                    <span class="font-bold">{profile.following}</span> Following
                  </button>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex gap-2">
                  {#if profile.isOwnProfile}
                    <button class="btn-primary">Edit Profile</button>
                  {:else}
                    <button
                      class="{profile.isFollowing ? 'btn-secondary' : 'btn-primary'}"
                      on:click={toggleFollow}
                    >
                      {profile.isFollowing ? 'Following' : 'Follow'}
                    </button>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Content Filter Tabs -->
      <div class="mb-6 flex overflow-x-auto border-b border-[#E0E0E0] dark:border-[#2D2D2D]">
        <button
          class="whitespace-nowrap px-4 py-2 text-sm font-medium {selectedTab === 'all' ? getAccentColorClass('text') + ' border-b-2 ' + getAccentColorClass('border') : 'text-gray-500 dark:text-gray-400'}"
          on:click={() => filterMedia('all')}
        >
          All Work
        </button>
        <button
          class="whitespace-nowrap px-4 py-2 text-sm font-medium {selectedTab === 'images' ? getAccentColorClass('text') + ' border-b-2 ' + getAccentColorClass('border') : 'text-gray-500 dark:text-gray-400'}"
          on:click={() => filterMedia('images')}
        >
          Images
        </button>
        <button
          class="whitespace-nowrap px-4 py-2 text-sm font-medium {selectedTab === 'videos' ? getAccentColorClass('text') + ' border-b-2 ' + getAccentColorClass('border') : 'text-gray-500 dark:text-gray-400'}"
          on:click={() => filterMedia('videos')}
        >
          Videos
        </button>
        <button
          class="whitespace-nowrap px-4 py-2 text-sm font-medium {selectedTab === 'audio' ? getAccentColorClass('text') + ' border-b-2 ' + getAccentColorClass('border') : 'text-gray-500 dark:text-gray-400'}"
          on:click={() => filterMedia('audio')}
        >
          Audio
        </button>
      </div>
      
      <!-- Media Grid -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {#each filteredMedia as item (item.id)}
          <MediaCard media={item} />
        {/each}
      </div>
      
      <!-- Empty State for No Content -->
      {#if profile.media.length === 0}
        <div class="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-[#E0E0E0] bg-white p-8 text-center dark:border-[#2D2D2D] dark:bg-[#2D2D2D]">
          <svg xmlns="http://www.w3.org/2000/svg" class="mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 class="mb-2 text-xl font-medium">No Content Yet</h3>
          <p class="mb-4 text-gray-500 dark:text-gray-400">This creator hasn't uploaded any work yet.</p>
          {#if profile.isOwnProfile}
            <button class="btn-primary flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Upload Your First Work
            </button>
          {/if}
        </div>
      {/if}
    {/if}
  </main>