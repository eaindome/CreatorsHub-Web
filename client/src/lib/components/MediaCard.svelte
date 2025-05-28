<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fly, scale, fade } from 'svelte/transition';

	export let media: {
		id: string;
		type: 'image' | 'video' | 'audio';
		url: string;
		thumbnailUrl: string;
		creator: {
			id: string;
			username: string;
			avatarUrl: string;
		};
		tags: string[];
		liked: boolean;
		bookmarked: boolean;
		likes: number;
	};

	const dispatch = createEventDispatcher();

	let isHovered = false;
	let showFullOverlay = false;
	let likeAnimation = false;

	function handleLike() {
		likeAnimation = true;
		setTimeout(() => likeAnimation = false, 800);
		dispatch('like', media.id);
	}

	function handleBookmark() {
		dispatch('bookmark', media.id);
	}

	function handleMouseEnter() {
		isHovered = true;
	}

	function handleMouseLeave() {
		isHovered = false;
		showFullOverlay = false;
	}
  
	function handleMediaClick() {
		showFullOverlay = true;
	}
</script>

<div
	class="media-card group relative transform overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md dark:bg-[var(--midnight-gray)]"
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
	role="region"
	aria-label="Media card"
>
	<!-- Media Type Badge -->
	<div class="absolute left-3 top-3 z-10 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm">
		{#if media.type === 'image'}
			<div class="flex items-center">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
				<span class="ml-1 text-xs font-medium text-white">Image</span>
			</div>
		{:else if media.type === 'video'}
			<div class="flex items-center">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
				</svg>
				<span class="ml-1 text-xs font-medium text-white">Video</span>
			</div>
		{:else if media.type === 'audio'}
			<div class="flex items-center">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
				</svg>
				<span class="ml-1 text-xs font-medium text-white">Audio</span>
			</div>
		{/if}
	</div>

	<!-- Media Preview -->
	<div class="relative aspect-square overflow-hidden">
		<div class="h-full w-full overflow-hidden">
			{#if media.type === 'image'}
				<button
					class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
					style="background-image: url({media.thumbnailUrl}); background-size: cover; background-position: center;"
					on:click={handleMediaClick}
					on:keydown={(e) => e.key === 'Enter' && handleMediaClick()}
					aria-label={`View work by ${media.creator.username}`}
				>
				</button>
			{:else if media.type === 'video'}
				<div
					class="relative h-full w-full"
					on:click={handleMediaClick}
					on:keydown={(e) => e.key === 'Enter' && handleMediaClick()}
					role="button"
					tabindex="0"
					aria-label="Play video"
				>
					<img
						src={media.thumbnailUrl}
						alt={`Video by ${media.creator.username}`}
						class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
					/>
					<div class="absolute inset-0 flex items-center justify-center">
						<div class="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 transition-transform duration-300 group-hover:scale-110 backdrop-blur-sm group-hover:bg-[var(--coral-glow)]/80">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-7 w-7 text-white"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
					</div>
				</div>
			{:else if media.type === 'audio'}
				<button
					class="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--teal-spark)] to-[var(--deep-teal)]"
					on:click={handleMediaClick}
					on:keydown={(e) => e.key === 'Enter' && handleMediaClick()}
					aria-label={`Play audio by ${media.creator.username}`}
				>
					<img
						src={media.thumbnailUrl}
						alt={`Audio by ${media.creator.username}`}
						class="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
					/>
					<div class="absolute inset-0 flex items-center justify-center">
						<div class="flex items-end space-x-2 bg-black/20 p-4 rounded-full backdrop-blur-sm">
							{#each Array(5) as _, i}
								<div
									class="w-1.5 audio-bar rounded-full bg-white"
									style="height: {15 + Math.random() * 20}px; animation-delay: {i * 0.15}s"
								></div>
							{/each}
						</div>
					</div>
				</button>
			{/if}
		</div>

		<!-- Simple Hover Overlay - Always visible but more prominent on hover -->
		<div 
			class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/10 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
		></div>

		<!-- Full Overlay (on click or deep hover) -->
		{#if showFullOverlay}
			<div 
				class="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300"
				transition:fade={{ duration: 150 }}
			>
				<div class="mb-4 flex space-x-4">
					<button
						class="flex items-center space-x-1 rounded-full bg-[var(--coral-glow)] px-4 py-2 text-white transition-transform duration-200 hover:scale-105"
						on:click={() => {}}
						aria-label="View full media"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
						</svg>
						<span>View</span>
					</button>
					
					<button
						class="flex items-center space-x-1 rounded-full bg-[var(--teal-spark)] px-4 py-2 text-white transition-transform duration-200 hover:scale-105"
						on:click={handleBookmark}
						aria-label={media.bookmarked ? 'Remove bookmark' : 'Bookmark media'}
					>
						{#if media.bookmarked}
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
								<path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
							</svg>
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
							</svg>
						{/if}
						<span>{media.bookmarked ? 'Saved' : 'Save'}</span>
					</button>
				</div>
				
				<div class="mt-2 flex flex-wrap justify-center gap-1 px-6">
					{#each media.tags as tag}
						<a
							href={`/tag/${tag}`}
							class="rounded-full bg-white/20 px-2 py-0.5 text-xs text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/30"
						>
							#{tag}
						</a>
					{/each}
				</div>
			</div>
		{/if}
		
		<!-- Creator info in image corner -->
		<a 
			href={`/profile/${media.creator.id}`} 
			class="absolute bottom-3 left-3 flex items-center rounded-full bg-black/40 p-1 pr-3 backdrop-blur-sm transition-all duration-300 hover:bg-black/60"
		>
			<div class="mr-2 h-7 w-7 overflow-hidden rounded-full border-2 border-[var(--teal-spark)]">
				<img
					src={media.creator.avatarUrl}
					alt={media.creator.username}
					class="h-full w-full object-cover"
				/>
			</div>
			<span class="text-sm font-medium text-white">
				{media.creator.username}
			</span>
		</a>
	</div>

	<!-- Bottom Action Bar -->
	<div class="flex items-center justify-between bg-white p-3 dark:bg-[var(--midnight-gray)]">
		<div class="flex items-center space-x-4">
			<!-- Like Button -->
			<button
				on:click={handleLike}
				class="relative flex items-center text-[var(--charcoal)] transition-colors duration-200 hover:text-[var(--coral-glow)] dark:text-[var(--soft-white)] dark:hover:text-[var(--coral-glow)]"
				aria-label={media.liked ? 'Unlike media' : 'Like media'}
			>
				<div class="relative">
					{#if media.liked}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 text-[var(--coral-glow)]"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
								clip-rule="evenodd"
							/>
						</svg>
					{:else}
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
								d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
							/>
						</svg>
					{/if}
					
					{#if likeAnimation}
						<div class="absolute inset-0" transition:scale={{ duration: 700, start: 1.8 }}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 text-[var(--coral-glow)]"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					{/if}
				</div>

				<span class="ml-1 text-sm font-medium">{media.likes}</span>
			</button>

			<!-- Comment Button -->
			<button
				class="flex items-center text-[var(--charcoal)] transition-colors duration-200 hover:text-[var(--teal-spark)] dark:text-[var(--soft-white)] dark:hover:text-[var(--teal-spark)]"
				aria-label="Comment on media"
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
						d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
					/>
				</svg>
			</button>
		</div>

		<!-- Share & Bookmark Buttons -->
		<div class="flex items-center space-x-4">
			<!-- Share Button -->
			<button
				class="text-[var(--charcoal)] transition-colors duration-200 hover:text-[var(--teal-spark)] dark:text-[var(--soft-white)] dark:hover:text-[var(--teal-spark)]"
				aria-label="Share media"
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
						d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
					/>
				</svg>
			</button>

			<!-- Bookmark Button -->
			<button
				on:click={handleBookmark}
				class="text-[var(--charcoal)] transition-colors duration-200 hover:text-[var(--mustard-pop)] dark:text-[var(--soft-white)] dark:hover:text-[var(--mustard-pop)]"
				aria-label={media.bookmarked ? 'Remove bookmark' : 'Bookmark media'}
			>
				{#if media.bookmarked}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 text-[var(--mustard-pop)]"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
					</svg>
				{:else}
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
							d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
						/>
					</svg>
				{/if}
			</button>
		</div>
	</div>
</div>

<style>
	@keyframes pulse {
		0%, 100% {
			transform: scaleY(1);
		}
		50% {
			transform: scaleY(1.5);
		}
	}

	.audio-bar {
		animation: pulse 1.5s infinite;
	}
</style>