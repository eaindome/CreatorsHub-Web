<script lang="ts">
	import type { MediaType, SortOption } from '$lib/types/media';

	export let isFilterOpen: boolean;
	export let selectedMediaType: MediaType;
	export let selectedSort: SortOption;
	export let selectedTags: string[];
	export let availableTags: string[];
	export let onMediaTypeChange: (type: MediaType) => void;
	export let onSortChange: (sort: SortOption) => void;
	export let onTagToggle: (tag: string) => void;
	export let onResetFilters: () => void;
	export let onToggleFilterPanel: () => void;
</script>

<aside
	class={`mb-4 transition-all duration-300 md:mb-0 md:w-64 md:pr-6 ${isFilterOpen ? 'block' : 'hidden md:block'}`}
>
	<div
		class="sticky top-24 rounded-lg border border-[#E0E0E0] bg-white p-4 shadow-sm dark:border-[#3D3D3D] dark:bg-[#2D2D2D]"
	>
		<div class="mb-6 flex items-center justify-between">
			<h2 class="text-lg font-semibold">Filters</h2>
			<button on:click={onResetFilters} class="text-sm text-[#4ECDC4] hover:text-[#3AA8A0]">
				Reset All
			</button>
		</div>

		<!-- Media Type Filter -->
		<div class="mb-6">
			<h3 class="mb-2 font-medium">Media Type</h3>
			<div class="flex flex-wrap gap-2">
				{#each ['all', 'image', 'video', 'audio'] as type (type)}
					<button
						on:click={() => onMediaTypeChange(type as MediaType)}
						class={`rounded-full px-3 py-1 text-sm ${selectedMediaType === type ? 'bg-[#FF6B6B] text-white' : 'bg-[#E0E0E0] text-[#333333] hover:bg-[#E0E0E0]/80 dark:bg-[#3D3D3D] dark:text-[#E6E6E6]'}`}
					>
						{type.charAt(0).toUpperCase() + type.slice(1)}
					</button>
				{/each}
			</div>
		</div>

		<!-- Sort Options -->
		<div class="mb-6">
			<h3 class="mb-2 font-medium">Sort By</h3>
			<div class="flex flex-col space-y-2">
				{#each ['relevance', 'recent', 'popular'] as sort}
					<button
						on:click={() => onSortChange(sort as SortOption)}
						class={`rounded-lg px-3 py-2 text-left text-sm ${selectedSort === sort ? 'bg-[#4ECDC4]/20 text-[#4ECDC4]' : 'hover:bg-[#E0E0E0]/50 dark:hover:bg-[#3D3D3D]/50'}`}
					>
						{sort === 'relevance'
							? 'Relevance'
							: sort === 'recent'
								? 'Most Recent'
								: 'Most Popular'}
					</button>
				{/each}
			</div>
		</div>

		<!-- Tags Filter -->
		<div>
			<h3 class="mb-2 font-medium">Popular Tags</h3>
			<div class="flex flex-wrap gap-2">
				{#each availableTags.slice(0, 10) as tag}
					<button
						on:click={() => onTagToggle(tag)}
						class={`rounded-full px-3 py-1 text-sm ${selectedTags.includes(tag) ? 'bg-[#FFC107] text-[#333333]' : 'bg-[#E0E0E0] text-[#333333] hover:bg-[#E0E0E0]/80 dark:bg-[#3D3D3D] dark:text-[#E6E6E6]'}`}
					>
						#{tag}
					</button>
				{/each}
			</div>
		</div>
	</div>
</aside>
