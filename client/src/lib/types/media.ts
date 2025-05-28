export type MediaType = 'all' | 'image' | 'video' | 'audio';

export type SortOption = 'relevance' | 'recent' | 'popular';

export interface MediaItem {
	id: string;
	type: 'image' | 'video' | 'audio';
	title: string;
	preview: string;
	url: string;
	creator: {
		id: string;
		name: string;
		username: string;
		avatar: string;
		tags: string[];
	};
	tags: string[];
	likes: number;
	isLiked: boolean;
	isBookmarked: boolean;
	createdAt: string;
}
