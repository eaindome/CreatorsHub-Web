// @ts-expect-error Supabase client initialization may have type issues due to environment variables
import { createClient } from '@supabase/supabase-js';
import type { UploadMetadata, MediaType } from '../types/upload';

// Initialize the Supabase client
// Replace with your Supabase URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload media file to Supabase storage
 */
export async function uploadMedia(file: File, userId: string, mediaType: MediaType) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  const filePath = `${mediaType}s/${fileName}`;
  
  const { error } = await supabase
    .storage
    .from('media')
    .upload(filePath, file);
    
  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
  
  // Get the public URL for the uploaded file
  const { data: publicUrlData } = supabase
    .storage
    .from('media')
    .getPublicUrl(filePath);
    
  return publicUrlData.publicUrl;
}

/**
 * Save media metadata to the database
 */
export async function saveMediaMetadata(metadata: UploadMetadata) {
  const { error } = await supabase
    .from('content')
    .insert([metadata]);
    
  if (error) {
    throw new Error(`Failed to save metadata: ${error.message}`);
  }
  
  return true;
}

/**
 * Complete upload process (file upload + metadata)
 */
export async function completeUpload(file: File, userId: string, metadata: {
  title: string;
  description: string;
  tags: string[];
  mediaType: MediaType;
}) {
  try {
    // Upload the file first
    const fileUrl = await uploadMedia(file, userId, metadata.mediaType);
    
    // Then save the metadata with the file URL
    await saveMediaMetadata({
      ...metadata,
      fileUrl,
      userId,
      createdAt: new Date().toISOString()
    });
    
    return { success: true, fileUrl };
  } catch (error) {
    console.error('Upload process failed:', error);
    throw error;
  }
}