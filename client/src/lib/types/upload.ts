export type MediaType = 'image' | 'video' | 'audio';

export interface UploadMetadata {
  title: string;
  description: string;
  tags: string[];
  mediaType: MediaType;
  fileUrl: string;
  userId: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  profileImage: string;
  tags: string[];
  accentColor: 'coral' | 'teal' | 'mustard';
  followers: number;
  following: number;
}