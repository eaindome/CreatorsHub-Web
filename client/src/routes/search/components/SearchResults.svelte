<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	// Import SearchBar from the correct location
	import SearchBar from '$lib/components/SearchBar.svelte';

	// Types
	type MediaType = 'all' | 'image' | 'video' | 'audio';
	type SortOption = 'relevance' | 'recent' | 'popular';

	interface Creator {
		id: string;
		name: string;
		username: string;
		avatar: string;
		tags: string[];
	}

	interface MediaItem {
		id: string;
		type: MediaType;
		title: string;
		preview: string;
		creator: Creator;
		tags: string[];
		likes: number;
		isLiked: boolean;
		isBookmarked: boolean;
		createdAt: string;
	}

	// State
	let searchQuery = '';
	let isLoading = true;
	let results: MediaItem[] = [];
	let hasResults = true;

	// Filter and sort state
	let selectedMediaType: MediaType = 'all';
	let selectedSort: SortOption = 'relevance';
	let selectedTags: string[] = [];
	let isFilterOpen = true; // Start with filter open on desktop

	// Mock data for development
	const mockResults: MediaItem[] = [
		{
			id: '1',
			type: 'image',
			title: 'Urban Portrait Series',
			preview: '/images/sample1.jpg',
			creator: {
				id: 'c1',
				name: 'Alex Morgan',
				username: 'alexmorgan',
				avatar: '/avatars/alex.jpg',
				tags: ['photographer', 'portrait']
			},
			tags: ['portrait', 'urban', 'photography'],
			likes: 124,
			isLiked: false,
			isBookmarked: true,
			createdAt: '2025-04-15T10:30:00Z'
		},
		{
			id: '2',
			type: 'video',
			title: 'City Lights Timelapse',
			preview: '/images/sample2.jpg',
			creator: {
				id: 'c2',
				name: 'Maya Chen',
				username: 'mayafilms',
				avatar: '/avatars/maya.jpg',
				tags: ['filmmaker', 'documentary']
			},
			tags: ['timelapse', 'urban', 'filmmaker'],
			likes: 89,
			isLiked: true,
			isBookmarked: false,
			createdAt: '2025-04-17T14:20:00Z'
		},
		{
			id: '3',
			type: 'audio',
			title: 'Ambient Mornings',
			preview: '/images/sample3.jpg',
			creator: {
				id: 'c3',
				name: 'James Wilson',
				username: 'jameswsound',
				avatar: '/avatars/james.jpg',
				tags: ['musician', 'electronic']
			},
			tags: ['ambient', 'electronic', 'musician'],
			likes: 56,
			isLiked: false,
			isBookmarked: false,
			createdAt: '2025-04-19T09:15:00Z'
		},
		{
			id: '4',
			type: 'image',
			title: 'Abstract Flow Series',
			preview: '/images/sample4.jpg',
			creator: {
				id: 'c4',
				name: 'Sophia Lee',
				username: 'sophialeeart',
				avatar: '/avatars/sophia.jpg',
				tags: ['painter', 'abstract']
			},
			tags: ['abstract', 'color', 'painter'],
			likes: 201,
			isLiked: true,
			isBookmarked: true,
			createdAt: '2025-04-12T16:45:00Z'
		},
		{
			id: '5',
			type: 'video',
			title: 'Stop Motion Stories',
			preview: '/images/sample5.jpg',
			creator: {
				id: 'c5',
				name: 'David Park',
				username: 'davidanimate',
				avatar: '/avatars/david.jpg',
				tags: ['animator', '3d']
			},
			tags: ['animation', 'stopmotion', 'animator'],
			likes: 142,
			isLiked: false,
			isBookmarked: false,
			createdAt: '2025-04-20T11:30:00Z'
		},
		{
			id: '6',
			type: 'audio',
			title: 'Spoken Word Collection',
			preview: '/images/sample6.jpg',
			creator: {
				id: 'c6',
				name: 'Elena Martinez',
				username: 'elenapoetry',
				avatar: '/avatars/elena.jpg',
				tags: ['poet', 'spoken word']
			},
			tags: ['poetry', 'voice', 'poet'],
			likes: 78,
			isLiked: true,
			isBookmarked: false,
			createdAt: '2025-04-18T13:10:00Z'
		}
	];

	// Toggle like state
	function toggleLike(id: string) {
		results = results.map((item) => {
			if (item.id === id) {
				return {
					...item,
					isLiked: !item.isLiked,
					likes: item.isLiked ? item.likes - 1 : item.likes + 1
				};
			}
			return item;
		});
	}

	// Toggle bookmark state
	function toggleBookmark(id: string) {
		results = results.map((item) => {
			if (item.id === id) {
				return { ...item, isBookmarked: !item.isBookmarked };
			}
			return item;
		});
	}

	// Toggle filter panel on mobile
	function toggleFilterPanel() {
		isFilterOpen = !isFilterOpen;
	}

	// Toggle tag selection
	function toggleTag(tag: string) {
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter((t) => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
		filterResults();
	}

	// Set media type filter
	function setMediaType(type: MediaType) {
		selectedMediaType = type;
		filterResults();
	}

	// Set sort option
	function setSort(sort: SortOption) {
		selectedSort = sort;
		filterResults();
	}

	// Filter and sort results
	function filterResults() {
		let filtered = [...mockResults];

		// Apply media type filter
		if (selectedMediaType !== 'all') {
			filtered = filtered.filter((item) => item.type === selectedMediaType);
		}

		// Apply tag filters
		if (selectedTags.length > 0) {
			filtered = filtered.filter((item) =>
				selectedTags.some((tag) => item.tags.includes(tag) || item.creator.tags.includes(tag))
			);
		}

		// Apply search query filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(item) =>
					item.title.toLowerCase().includes(query) ||
					item.tags.some((tag) => tag.toLowerCase().includes(query)) ||
					item.creator.name.toLowerCase().includes(query) ||
					item.creator.tags.some((tag) => tag.toLowerCase().includes(query))
			);
		}

		// Apply sorting
		switch (selectedSort) {
			case 'recent':
				filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
				break;
			case 'popular':
				filtered.sort((a, b) => b.likes - a.likes);
				break;
			case 'relevance':
			default:
				// For relevance, we'd typically use a more complex algorithm
				// For now, we'll just keep the default order which is presumed to be by relevance
				break;
		}

		results = filtered;
		hasResults = results.length > 0;
	}

	// Get query from URL on mount
	onMount(() => {
		if (browser) {
			const urlParams = new URLSearchParams(window.location.search);
			searchQuery = urlParams.get('q') || '';

			// Get tag from URL if present
			const tagParam = urlParams.get('tag');
			if (tagParam) {
				selectedTags = [tagParam];
			}

			// Simulate loading delay
			setTimeout(() => {
				filterResults();
				isLoading = false;
			}, 500);
		}
	});

	// Handle new search
	function handleSearch(event: CustomEvent) {
		searchQuery = event.detail;
		filterResults();
	}

	// Get all unique tags from results for filter options
	$: availableTags = [
		...new Set([
			...mockResults.flatMap((item) => item.tags),
			...mockResults.flatMap((item) => item.creator.tags)
		])
	];

	// Reset all filters
	function resetFilters() {
		selectedMediaType = 'all';
		selectedSort = 'relevance';
		selectedTags = [];
		filterResults();
	}
</script>

<svelte:head>
	<title>Search Results - CreatorsHub</title>
</svelte:head>

<div class="min-h-screen">
	<main class="container mx-auto p-4">
		<div class="flex flex-col md:flex-row">
			<!-- Filter sidebar - hidden on mobile unless toggled -->
			<aside
				class={`mb-4 transition-all duration-300 md:mb-0 md:w-64 md:pr-6 ${isFilterOpen ? 'block' : 'hidden md:block'}`}
			>
				<div
					class="sticky top-24 rounded-lg border border-[#E0E0E0] bg-white p-4 shadow-sm dark:border-[#3D3D3D] dark:bg-[#2D2D2D]"
				>
					<div class="mb-6 flex items-center justify-between">
						<h2 class="text-lg font-semibold">Filters</h2>
						<button on:click={resetFilters} class="text-sm text-[#4ECDC4] hover:text-[#3AA8A0]">
							Reset All
						</button>
					</div>

					<!-- Media Type Filter -->
					<div class="mb-6">
						<h3 class="mb-2 font-medium">Media Type</h3>
						<div class="flex flex-wrap gap-2">
							<button
								on:click={() => setMediaType('all')}
								class={`rounded-full px-3 py-1 text-sm ${
									selectedMediaType === 'all'
										? 'bg-[#FF6B6B] text-white'
										: 'bg-[#E0E0E0] text-[#333333] hover:bg-[#E0E0E0]/80 dark:bg-[#3D3D3D] dark:text-[#E6E6E6]'
								}`}
							>
								All
							</button>
							<button
								on:click={() => setMediaType('image')}
								class={`rounded-full px-3 py-1 text-sm ${
									selectedMediaType === 'image'
										? 'bg-[#FF6B6B] text-white'
										: 'bg-[#E0E0E0] text-[#333333] hover:bg-[#E0E0E0]/80 dark:bg-[#3D3D3D] dark:text-[#E6E6E6]'
								}`}
							>
								Images
							</button>
							<button
								on:click={() => setMediaType('video')}
								class={`rounded-full px-3 py-1 text-sm ${
									selectedMediaType === 'video'
										? 'bg-[#FF6B6B] text-white'
										: 'bg-[#E0E0E0] text-[#333333] hover:bg-[#E0E0E0]/80 dark:bg-[#3D3D3D] dark:text-[#E6E6E6]'
								}`}
							>
								Videos
							</button>
							<button
								on:click={() => setMediaType('audio')}
								class={`rounded-full px-3 py-1 text-sm ${
									selectedMediaType === 'audio'
										? 'bg-[#FF6B6B] text-white'
										: 'bg-[#E0E0E0] text-[#333333] hover:bg-[#E0E0E0]/80 dark:bg-[#3D3D3D] dark:text-[#E6E6E6]'
								}`}
							>
								Audio
							</button>
						</div>
					</div>

					<!-- Sort Options -->
					<div class="mb-6">
						<h3 class="mb-2 font-medium">Sort By</h3>
						<div class="flex flex-col space-y-2">
							<button
								on:click={() => setSort('relevance')}
								class={`rounded-lg px-3 py-2 text-left text-sm ${
									selectedSort === 'relevance'
										? 'bg-[#4ECDC4]/20 text-[#4ECDC4]'
										: 'hover:bg-[#E0E0E0]/50 dark:hover:bg-[#3D3D3D]/50'
								}`}
							>
								Relevance
							</button>
							<button
								on:click={() => setSort('recent')}
								class={`rounded-lg px-3 py-2 text-left text-sm ${
									selectedSort === 'recent'
										? 'bg-[#4ECDC4]/20 text-[#4ECDC4]'
										: 'hover:bg-[#E0E0E0]/50 dark:hover:bg-[#3D3D3D]/50'
								}`}
							>
								Most Recent
							</button>
							<button
								on:click={() => setSort('popular')}
								class={`rounded-lg px-3 py-2 text-left text-sm ${
									selectedSort === 'popular'
										? 'bg-[#4ECDC4]/20 text-[#4ECDC4]'
										: 'hover:bg-[#E0E0E0]/50 dark:hover:bg-[#3D3D3D]/50'
								}`}
							>
								Most Popular
							</button>
						</div>
					</div>

					<!-- Tags Filter -->
					<div>
						<h3 class="mb-2 font-medium">Popular Tags</h3>
						<div class="flex flex-wrap gap-2">
							{#each availableTags.slice(0, 10) as tag}
								<button
									on:click={() => toggleTag(tag)}
									class={`rounded-full px-3 py-1 text-sm ${
										selectedTags.includes(tag)
											? 'bg-[#FFC107] text-[#333333]'
											: 'bg-[#E0E0E0] text-[#333333] hover:bg-[#E0E0E0]/80 dark:bg-[#3D3D3D] dark:text-[#E6E6E6]'
									}`}
								>
									#{tag}
								</button>
							{/each}
						</div>
					</div>
				</div>
			</aside>

			<!-- Search Results -->
			<div class="flex-1">
				<!-- Search query display -->
				<div class="mb-6">
					<a href="/" class="mb-2 inline-flex items-center text-[#4ECDC4] hover:text-[#3AA8A0]">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-1 h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
						Back to Home
					</a>
					<h1 class="text-2xl font-bold md:text-3xl">
						{#if searchQuery}
							Results for "{searchQuery}"
						{:else if selectedTags.length > 0}
							Results for #{selectedTags.join(', #')}
						{:else}
							All Results
						{/if}
					</h1>
					<p class="mt-1 text-sm text-[#333333]/70 dark:text-[#E6E6E6]/70">
						{results.length}
						{results.length === 1 ? 'result' : 'results'} found
					</p>
				</div>

				{#if isLoading}
					<!-- Loading state -->
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{#each Array(6) as _, i}
							<div class="card animate-pulse">
								<div class="aspect-[4/3] w-full bg-[#E0E0E0] dark:bg-[#3D3D3D]"></div>
								<div class="p-4">
									<div class="mb-2 h-4 w-3/4 rounded bg-[#E0E0E0] dark:bg-[#3D3D3D]"></div>
									<div class="mb-4 h-3 w-1/2 rounded bg-[#E0E0E0] dark:bg-[#3D3D3D]"></div>
									<div class="flex space-x-2">
										<div class="h-6 w-16 rounded-full bg-[#E0E0E0] dark:bg-[#3D3D3D]"></div>
										<div class="h-6 w-16 rounded-full bg-[#E0E0E0] dark:bg-[#3D3D3D]"></div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{:else if hasResults}
					<!-- Results grid -->
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{#each results as item}
							<div class="card group overflow-hidden">
								<!-- Media preview with type indicator -->
								<div
									class="relative aspect-[4/3] w-full overflow-hidden bg-[#E0E0E0] dark:bg-[#3D3D3D]"
								>
									<!-- Media type icon overlay -->
									<div class="absolute top-2 left-2 rounded-full bg-black/50 p-1">
										{#if item.type === 'video'}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-4 w-4 text-white"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z"
												/>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
												/>
											</svg>
										{:else if item.type === 'audio'}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-4 w-4 text-white"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
												/>
											</svg>
										{:else}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-4 w-4 text-white"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
												/>
											</svg>
										{/if}
									</div>

									<!-- Hover actions -->
									<div
										class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
									>
										<button
											class="mr-4 rounded-full bg-white p-2 text-[#333333] shadow-lg transition-transform duration-300 hover:scale-110"
											aria-label="View item details"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-6 w-6"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												/>
											</svg>
										</button>
										<button
											class="rounded-full bg-white p-2 text-[#333333] shadow-lg transition-transform duration-300 hover:scale-110"
											aria-label="Download item"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-6 w-6"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
												/>
											</svg>
										</button>
									</div>

									<!-- Image placeholder -->
									<img
										src={item.preview}
										alt={item.title}
										class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
										on:error={(e) => { const target = e.target as HTMLImageElement; if (target) target.src = '/placeholder.jpg'; }}
									/>
								</div>

								<div class="p-4">
									<!-- Title and creator info -->
									<div class="mb-3">
										<h2 class="text-lg font-medium">{item.title}</h2>
										<div class="mt-1 flex items-center">
											<div
												class="h-6 w-6 overflow-hidden rounded-full bg-[#E0E0E0] dark:bg-[#3D3D3D]"
											>
												<img
													src={item.creator.avatar}
													alt={item.creator.name}
													class="h-full w-full object-cover"
													on:error={(e) => { const target = e.target as HTMLImageElement; if (target) target.src = '/avatar-placeholder.jpg'; }}
												/>
											</div>
											<span class="ml-2 text-sm">{item.creator.name}</span>
										</div>
									</div>

									<!-- Tags -->
									<div class="mb-3 flex flex-wrap gap-1">
										{#each item.tags.slice(0, 3) as tag}
											<button on:click={() => toggleTag(tag)} class="tag-badge">
												#{tag}
											</button>
										{/each}
									</div>

									<!-- Action buttons -->
									<div class="flex items-center justify-between">
										<div class="flex items-center space-x-1">
											<button
												on:click={() => toggleLike(item.id)}
												class="group flex items-center space-x-1 rounded-full px-2 py-1 hover:bg-[#FF6B6B]/10"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class={`h-5 w-5 ${item.isLiked ? 'fill-[#FF6B6B] text-[#FF6B6B]' : 'text-[#333333] dark:text-[#E6E6E6]'}`}
													fill={item.isLiked ? 'currentColor' : 'none'}
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
													/>
												</svg>
												<span class="text-sm">{item.likes}</span>
											</button>

											<button
												on:click={() => toggleBookmark(item.id)}
												class="rounded-full p-1 hover:bg-[#4ECDC4]/10"
												aria-label={item.isBookmarked ? 'Remove bookmark' : 'Bookmark this item'}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class={`h-5 w-5 ${item.isBookmarked ? 'fill-[#4ECDC4] text-[#4ECDC4]' : 'text-[#333333] dark:text-[#E6E6E6]'}`}
													fill={item.isBookmarked ? 'currentColor' : 'none'}
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
													/>
												</svg>
											</button>
										</div>

										<span class="text-xs text-[#333333]/60 dark:text-[#E6E6E6]/60">
											{new Date(item.createdAt).toLocaleDateString()}
										</span>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<!-- No results message -->
					<div
						class="flex flex-col items-center justify-center rounded-lg border border-[#E0E0E0] bg-white py-12 text-center dark:border-[#3D3D3D] dark:bg-[#2D2D2D]"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mb-4 h-16 w-16 text-[#E0E0E0] dark:text-[#3D3D3D]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
						<h2 class="mb-2 text-2xl font-semibold text-[#FF6B6B]">No results found</h2>
						<p class="mb-6 max-w-md text-[#333333]/70 dark:text-[#E6E6E6]/70">
							{#if searchQuery}
								No work found for "{searchQuery}".
							{:else if selectedTags.length > 0}
								No work found for #{selectedTags.join(', #')}.
							{:else}
								No work found with the current filters.
							{/if}
							Try another search term or adjust your filters!
						</p>
						<button on:click={resetFilters} class="btn-secondary flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-2 h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
							Reset Filters
						</button>
					</div>
				{/if}

				{#if hasResults && results.length > 9}
					<!-- Pagination (simplified) -->
					<div class="mt-8 flex justify-center">
						<div class="inline-flex rounded-md shadow-sm">
							<button
								class="rounded-l-lg border border-r-0 border-[#E0E0E0] bg-white px-4 py-2 text-sm font-medium text-[#333333] hover:bg-[#E0E0E0]/20 dark:border-[#3D3D3D] dark:bg-[#2D2D2D] dark:text-[#E6E6E6] dark:hover:bg-[#3D3D3D]/50"
							>
								Previous
							</button>
							<button
								class="border-t border-b border-[#E0E0E0] bg-[#4ECDC4] px-4 py-2 text-sm font-medium text-white dark:border-[#3D3D3D]"
							>
								1
							</button>
							<button
								class="border border-[#E0E0E0] bg-white px-4 py-2 text-sm font-medium text-[#333333] hover:bg-[#E0E0E0]/20 dark:border-[#3D3D3D] dark:bg-[#2D2D2D] dark:text-[#E6E6E6] dark:hover:bg-[#3D3D3D]/50"
							>
								2
							</button>
							<button
								class="rounded-r-lg border border-l-0 border-[#E0E0E0] bg-white px-4 py-2 text-sm font-medium text-[#333333] hover:bg-[#E0E0E0]/20 dark:border-[#3D3D3D] dark:bg-[#2D2D2D] dark:text-[#E6E6E6] dark:hover:bg-[#3D3D3D]/50"
							>
								Next
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</main>

	<footer
		class="mt-12 border-t border-[#E0E0E0] bg-white py-6 dark:border-[#3D3D3D] dark:bg-[#1A1A1A]"
	>
		<div
			class="container mx-auto px-4 text-center text-sm text-[#333333]/60 dark:text-[#E6E6E6]/60"
		>
			<p>© 2025 CreatorsHub. All rights reserved.</p>
			<div class="mt-2 flex justify-center space-x-4">
				<a href="/terms" class="hover:text-[#FF6B6B]">Terms</a>
				<a href="/privacy" class="hover:text-[#FF6B6B]">Privacy</a>
				<a href="/help" class="hover:text-[#FF6B6B]">Help</a>
			</div>
		</div>
	</footer>
</div>

<style>
	/* Additional custom styles if needed */
	.card {
		transition:
			transform 0.2s ease-in-out,
			box-shadow 0.2s ease-in-out;
	}

	.card:hover {
		transform: translateY(-4px);
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}
</style>
