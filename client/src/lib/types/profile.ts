export interface MediaItem {
	id: string;
	url: string;
	type: 'image' | 'video' | 'audio';
	title: string;
	likes: number;
	bookmarks: number;
	tags: string[];
	thumbnailUrl: string; // Removed the optional ? marker
	creator: {
		id: string;
		username: string;
		avatarUrl: string;
	};
	liked: boolean;
	bookmarked: boolean;
	createdAt?: string;
}

export interface Profile {
	username: string;
	displayName: string;
	bio: string;
	profilePicture: string;
	accentColor: 'coral' | 'teal' | 'mustard';
	followers: number;
	following: number;
	isFollowing: boolean;
	isOwnProfile: boolean;
	tags: string[];
	media: MediaItem[];
	createdAt?: string;
	updatedAt?: string;
}

export interface ProfileResponse {
	profile: Profile;
	error?: string;
}

// For the API layer
export interface ProfileService {
	getProfileByUsername(username: string): Promise<ProfileResponse>;
	followUser(username: string): Promise<{ success: boolean; error?: string }>;
	unfollowUser(username: string): Promise<{ success: boolean; error?: string }>;
	updateProfile(profileData: Partial<Profile>): Promise<ProfileResponse>;
}
