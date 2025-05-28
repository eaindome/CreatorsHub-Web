<!-- src/routes/upload/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	// Types for our upload form
	type MediaType = 'image' | 'video' | 'audio' | null;
	type FileStatus =
		| 'idle'
		| 'dragging'
		| 'validating'
		| 'invalid'
		| 'valid'
		| 'uploading'
		| 'success'
		| 'error';

	// State management
	let fileInput: HTMLInputElement;
	let uploadedFile: File | null = null;
	let filePreview: string | null = null;
	let mediaType: MediaType = null;
	let title = '';
	let description = '';
	let tags: string[] = [];
	let newTag = '';
	let fileStatus: FileStatus = 'idle';
	let errorMessage = '';
	let dragging = false;
	let fileDropArea: HTMLDivElement;
	let uploadProgress = 0;

	// Maximum file sizes (in bytes)
	const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
	const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB
	const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10MB

	// Supported file formats
	const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/png'];
	const SUPPORTED_VIDEO_FORMATS = ['video/mp4'];
	const SUPPORTED_AUDIO_FORMATS = ['audio/mpeg', 'audio/wav'];

	// Get human-readable file size
	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return bytes + ' bytes';
		else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
		else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
	}

	onMount(() => {
		// Set up the drag-and-drop event listeners
		fileDropArea.addEventListener('dragenter', handleDragEnter);
		fileDropArea.addEventListener('dragover', handleDragOver);
		fileDropArea.addEventListener('dragleave', handleDragLeave);
		fileDropArea.addEventListener('drop', handleDrop);

		return () => {
			// Clean up event listeners
			fileDropArea.removeEventListener('dragenter', handleDragEnter);
			fileDropArea.removeEventListener('dragover', handleDragOver);
			fileDropArea.removeEventListener('dragleave', handleDragLeave);
			fileDropArea.removeEventListener('drop', handleDrop);
		};
	});

	// Event handlers for drag and drop
	function handleDragEnter(e: DragEvent) {
		e.preventDefault();
		dragging = true;
		fileStatus = 'dragging';
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragging = true;
		fileStatus = 'dragging';
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		dragging = false;
		fileStatus = uploadedFile ? 'valid' : 'idle';
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragging = false;

		if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
			handleFile(e.dataTransfer.files[0]);
		}
	}

	// Handle file selection from file input
	function handleFileSelect() {
		if (fileInput.files && fileInput.files.length > 0) {
			handleFile(fileInput.files[0]);
		}
	}

	// Process the selected file
	async function handleFile(file: File) {
		uploadedFile = null;
		filePreview = null;
		mediaType = null;
		fileStatus = 'validating';
		errorMessage = '';

		// Check file type
		if (SUPPORTED_IMAGE_FORMATS.includes(file.type)) {
			mediaType = 'image';
			if (file.size > MAX_IMAGE_SIZE) {
				showError(`Image too large. Maximum size is ${MAX_IMAGE_SIZE / (1024 * 1024)}MB.`);
				return;
			}
		} else if (SUPPORTED_VIDEO_FORMATS.includes(file.type)) {
			mediaType = 'video';
			if (file.size > MAX_VIDEO_SIZE) {
				showError(`Video too large. Maximum size is ${MAX_VIDEO_SIZE / (1024 * 1024)}MB.`);
				return;
			}
		} else if (SUPPORTED_AUDIO_FORMATS.includes(file.type)) {
			mediaType = 'audio';
			if (file.size > MAX_AUDIO_SIZE) {
				showError(`Audio too large. Maximum size is ${MAX_AUDIO_SIZE / (1024 * 1024)}MB.`);
				return;
			}
		} else {
			showError(
				'Unsupported file format. Please upload JPEG/PNG images, MP4 videos, or MP3/WAV audio files.'
			);
			return;
		}

		// Create file preview URL
		filePreview = URL.createObjectURL(file);
		uploadedFile = file;
		fileStatus = 'valid';
	}

	function showError(message: string) {
		errorMessage = message;
		fileStatus = 'invalid';
		setTimeout(() => {
			if (fileStatus === 'invalid') {
				fileStatus = 'idle';
				errorMessage = '';
			}
		}, 5000);
	}

	// Handle tag input
	function addTag() {
		if (newTag.trim() && !tags.includes(newTag.trim())) {
			// Add # prefix if not already present
			let formattedTag = newTag.trim();
			if (!formattedTag.startsWith('#')) {
				formattedTag = '#' + formattedTag;
			}
			tags = [...tags, formattedTag];
			newTag = '';
		}
	}

	function removeTag(tagToRemove: string) {
		tags = tags.filter((tag) => tag !== tagToRemove);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault();
			addTag();
		}
	}

	// Get file type icon
	function getFileTypeIcon() {
		switch (mediaType) {
			case 'image':
				return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>`;
			case 'video':
				return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
						</svg>`;
			case 'audio':
				return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
						</svg>`;
			default:
				return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
						</svg>`;
		}
	}

	// Submit the form for upload
	async function handleSubmit() {
		if (!uploadedFile || fileStatus !== 'valid') return;

		fileStatus = 'uploading';
		uploadProgress = 0;

		try {
			// Simulate upload progress
			const interval = setInterval(() => {
				uploadProgress += Math.random() * 15;
				if (uploadProgress >= 100) {
					uploadProgress = 100;
					clearInterval(interval);
				}
			}, 300);

			// Simulate upload delay
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Example of what an actual Supabase upload might look like:
			/*
        const { data, error } = await supabaseClient
          .storage
          .from('media')
          .upload(`${user.id}/${Date.now()}-${uploadedFile.name}`, uploadedFile);
          
        if (error) throw error;
        
        // Save metadata to database
        const { error: metadataError } = await supabaseClient
          .from('content')
          .insert({
            title,
            description,
            tags,
            media_url: data.Key,
            media_type: mediaType,
            user_id: user.id
          });
        
        if (metadataError) throw metadataError;
        */

			fileStatus = 'success';
			uploadProgress = 100;
			setTimeout(() => {
				// Reset form after success message
				resetForm();
			}, 3000);
		} catch (error) {
			console.error('Upload failed:', error);
			errorMessage = 'Upload failed. Please try again.';
			fileStatus = 'error';
		}
	}

	function resetForm() {
		uploadedFile = null;
		if (filePreview) {
			URL.revokeObjectURL(filePreview);
			filePreview = null;
		}
		mediaType = null;
		title = '';
		description = '';
		tags = [];
		fileStatus = 'idle';
		errorMessage = '';
		uploadProgress = 0;
	}
</script>

<div class="container mx-auto max-w-3xl px-4 py-8">
	<h1 class="mb-6 text-3xl font-bold text-center">Share Your Creation</h1>

	<div class="card rounded-xl shadow-lg bg-white dark:bg-[#1D1D1D] p-6 border border-[#E0E0E0] dark:border-[#2D2D2D]">
		<!-- Step indicator -->
		<!-- <div class="flex items-center justify-between mb-8">
			<div class="flex items-center">
				<div class="flex items-center justify-center w-8 h-8 rounded-full bg-[#4ECDC4] text-white font-bold">1</div>
				<div class="ml-2 font-medium">Upload</div>
			</div>
			<div class="h-1 w-16 bg-[#E0E0E0] dark:bg-[#2D2D2D]"></div>
			<div class="flex items-center">
				<div class="flex items-center justify-center w-8 h-8 rounded-full bg-[#E0E0E0] dark:bg-[#2D2D2D] text-gray-500 font-bold">2</div>
				<div class="ml-2 font-medium text-gray-500">Details</div>
			</div>
			<div class="h-1 w-16 bg-[#E0E0E0] dark:bg-[#2D2D2D]"></div>
			<div class="flex items-center">
				<div class="flex items-center justify-center w-8 h-8 rounded-full bg-[#E0E0E0] dark:bg-[#2D2D2D] text-gray-500 font-bold">3</div>
				<div class="ml-2 font-medium text-gray-500">Share</div>
			</div>
		</div> -->

		<!-- File Upload Area -->
		<div
			bind:this={fileDropArea}
			role="button"
			tabindex="0"
			aria-label="Upload file area. Click or drag files here to upload."
			class="mb-8 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300"
			class:border-[#4ECDC4]={fileStatus === 'dragging'}
			class:border-[#E0E0E0]={fileStatus !== 'dragging' && fileStatus !== 'error'}
			class:border-[#FF6B6B]={fileStatus === 'error'}
			class:bg-opacity-5={fileStatus === 'dragging'}
			class:bg-[#4ECDC4]={fileStatus === 'dragging'}
			class:h-72={!filePreview}
			class:min-h-48={filePreview}
			on:click={() => fileInput.click()}
			on:keydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					fileInput.click();
				}
			}}
		>
			{#if fileStatus === 'uploading'}
				<div class="flex flex-col items-center justify-center w-full">
					<div class="mb-3 h-16 w-16 animate-spin rounded-full border-4 border-[#FFC107] border-t-transparent"></div>
					<p class="text-lg font-medium mb-2">Uploading your creation...</p>
					<div class="w-full max-w-md bg-[#E0E0E0] dark:bg-[#2D2D2D] rounded-full h-2.5 mt-2 mb-4">
						<div class="bg-[#4ECDC4] h-2.5 rounded-full transition-all duration-300" style="width: {uploadProgress}%"></div>
					</div>
					<p class="text-sm text-gray-500">{uploadProgress.toFixed(0)}% complete</p>
				</div>
			{:else if fileStatus === 'success'}
				<div in:fade class="flex flex-col items-center text-[#4ECDC4]">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mb-4 h-16 w-16"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<p class="text-xl font-medium mb-2">Upload complete!</p>
					<p class="text-sm text-gray-500">Your creation has been uploaded successfully.</p>
				</div>
			{:else if filePreview}
				<div class="mb-4 w-full relative">
					{#if mediaType === 'image'}
						<img src={filePreview} alt="Preview" class="mx-auto max-h-72 rounded-lg object-contain" />
					{:else if mediaType === 'video'}
						<video src={filePreview} controls class="max-h-72 w-full rounded-lg">
							<track kind="captions" src="" label="English captions" />
							<p>
								Your browser doesn't support HTML5 video. Here is a <a href={filePreview} class="text-[#4ECDC4]">link to the video</a> instead.
							</p>
						</video>
					{:else if mediaType === 'audio'}
						<div class="rounded-lg bg-[#E0E0E0]/30 p-6 dark:bg-[#2D2D2D]">
							<audio src={filePreview} controls class="w-full mb-4"></audio>
							<!-- Waveform visualization with subtle animation -->
							<div class="mt-4 flex h-20 items-end justify-between gap-0.5">
								{#each Array(40) as _, i}
									<div
										class="w-full bg-[#4ECDC4] transition-all duration-1000"
										style="height: {Math.max(4, Math.random() * 100)}%; animation: pulse {2 + Math.random() * 3}s infinite alternate;"
									></div>
								{/each}
							</div>
						</div>
					{/if}
					
					<div class="mt-4 flex items-center justify-center gap-4">
						<div class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
							{@html getFileTypeIcon()}
							<span class="ml-1">{uploadedFile?.name}</span>
						</div>
						<span class="text-xs text-gray-500">{formatFileSize(uploadedFile?.size || 0)}</span>
					</div>
					
					<button
						class="mt-4 px-4 py-2 rounded-full bg-[#F5F5F5] dark:bg-[#2D2D2D] hover:bg-[#E0E0E0] dark:hover:bg-[#3D3D3D] text-sm font-medium transition-all duration-300"
						on:click={(e) => {
							e.stopPropagation();
							resetForm();
						}}
					>
						Choose a different file
					</button>
				</div>
			{:else}
				<div>
					<div class="bg-[#4ECDC4]/10 p-4 rounded-full mb-4 mx-auto w-24 h-24 flex items-center justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-12 w-12 text-[#4ECDC4]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
							/>
						</svg>
					</div>
					<p class="mb-3 text-xl font-medium">Drag and drop your file here</p>
					<p class="mb-4 text-base text-gray-500 dark:text-gray-400">Or click to browse files</p>
					<div class="flex flex-wrap justify-center gap-3 mb-4">
						<span class="px-3 py-1 bg-[#4ECDC4]/10 text-[#4ECDC4] rounded-full text-xs font-medium">JPEG/PNG</span>
						<span class="px-3 py-1 bg-[#4ECDC4]/10 text-[#4ECDC4] rounded-full text-xs font-medium">MP4</span>
						<span class="px-3 py-1 bg-[#4ECDC4]/10 text-[#4ECDC4] rounded-full text-xs font-medium">MP3/WAV</span>
					</div>
					<p class="text-xs text-gray-500 dark:text-gray-400">
						Max file size: Images (5MB), Videos (20MB), Audio (10MB)
					</p>
				</div>
			{/if}

			{#if errorMessage}
				<div in:fly={{ y: 10, duration: 300 }} class="mt-4 rounded-lg bg-[#FF6B6B]/10 p-3 text-sm text-[#FF6B6B]">
					<div class="flex items-center">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
						{errorMessage}
					</div>
				</div>
			{/if}
		</div>

		<input
			type="file"
			bind:this={fileInput}
			class="hidden"
			accept=".jpg,.jpeg,.png,.mp4,.mp3,.wav"
			on:change={handleFileSelect}
		/>

		<!-- Metadata Form -->
		<div class="space-y-6" class:opacity-50={!uploadedFile} class:pointer-events-none={!uploadedFile}>
			<h2 class="text-xl font-bold mb-4">Creation Details</h2>
			
			<!-- Title Input -->
			<div>
				<label for="title" class="mb-2 block text-sm font-medium"
					>Title <span class="text-gray-400">(optional)</span></label
				>
				<input
					type="text"
					id="title"
					bind:value={title}
					maxlength="50"
					class="w-full rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 transition-colors outline-none focus:border-[#4ECDC4] dark:border-[#2D2D2D] dark:bg-[#1A1A1A]"
					placeholder="Give your creation a title"
				/>
				<p class="mt-1 text-right text-xs text-gray-500">{title.length}/50</p>
			</div>

			<!-- Description Input -->
			<div>
				<label for="description" class="mb-2 block text-sm font-medium"
					>Description <span class="text-gray-400">(optional)</span></label
				>
				<textarea
					id="description"
					bind:value={description}
					maxlength="200"
					rows="3"
					class="w-full resize-none rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 transition-colors outline-none focus:border-[#4ECDC4] dark:border-[#2D2D2D] dark:bg-[#1A1A1A]"
					placeholder="Tell others about your creation"
				></textarea>
				<p class="mt-1 text-right text-xs text-gray-500">{description.length}/200</p>
			</div>

			<!-- Tags Input -->
			<div>
				<label for="tags" class="mb-2 block text-sm font-medium">Tags</label>
				<div
					class="flex flex-wrap items-center rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 transition-colors focus-within:border-[#4ECDC4] dark:border-[#2D2D2D] dark:bg-[#1A1A1A]"
				>
					<div class="flex flex-1 flex-wrap gap-2">
						{#each tags as tag}
							<span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#4ECDC4]/10 text-[#4ECDC4]">
								{tag}
								<button
									class="ml-1 rounded-full p-1 hover:bg-[#4ECDC4]/20"
									on:click={() => removeTag(tag)}
									aria-label={`Remove tag ${tag}`}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-3 w-3"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</span>
						{/each}
						<input
							type="text"
							id="tags"
							bind:value={newTag}
							on:keydown={handleKeydown}
							class="min-w-[120px] flex-grow bg-transparent outline-none my-1"
							placeholder={tags.length ? '' : 'Add tags (e.g., #animation, #poetry)'}
						/>
					</div>
					<button
						on:click={addTag}
						class="ml-2 px-3 py-1 rounded-full text-sm font-medium text-[#4ECDC4] border border-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white transition-colors"
						type="button"
					>
						Add
					</button>
				</div>
				<p class="mt-2 text-xs text-gray-500">Press Enter or click "Add" after each tag</p>
			</div>

			<!-- Submit Button -->
			<div class="pt-4">
				<button
					class="w-full rounded-lg bg-[#4ECDC4] px-6 py-4 text-lg font-medium text-white shadow-lg hover:bg-[#3AA8A0] transition-all duration-300 disabled:bg-[#E0E0E0] disabled:text-gray-500 disabled:cursor-not-allowed dark:disabled:bg-[#2D2D2D]"
					disabled={!uploadedFile || fileStatus !== 'valid'}
					on:click={handleSubmit}
				>
					{#if !uploadedFile}
						Upload a file first
					{:else}
						Upload Creation
					{/if}
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes pulse {
		0% {
			height: 20%;
		}
		100% {
			height: 100%;
		}
	}
</style>