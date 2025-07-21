import { uploadImage, deleteImage } from '@/lib/supabase';
import { FileObject } from '@supabase/storage-js';

export const uploadPropertyImage = async (file: File): Promise<string> => {
  return uploadImage(file, 'property-images');
};

export const uploadAgentImage = async (file: File): Promise<string> => {
  return uploadImage(file, 'agent-images');
};

export const uploadThumbnail = async (file: File): Promise<string> => {
  return uploadImage(file, 'thumbnails');
};

export const deletePropertyImage = async (path: string): Promise<FileObject[]> => {
  return deleteImage(path, 'property-images');
};

export const deleteAgentImage = async (path: string): Promise<FileObject[]> => {
  return deleteImage(path, 'agent-images');
};

export const deleteThumbnail = async (path: string): Promise<FileObject[]> => {
  return deleteImage(path, 'thumbnails');
}; 