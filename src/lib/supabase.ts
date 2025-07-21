import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function for image uploads
export async function uploadImage(file: File, bucket: string) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Helper function to delete images
export async function deleteImage(path: string, bucket: string) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
} 