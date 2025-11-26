import { api } from '../api';

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

/**
 * Upload a file to backend API
 * @param file - The file to upload
 * @param bucket - The storage bucket name (optional, for backend reference)
 * @param folder - Optional folder path within the bucket
 * @returns Promise with the public URL of the uploaded file
 */
export async function uploadFile(
  file: File,
  bucket: string = 'uploads',
  folder?: string
): Promise<UploadResult> {
  try {
    // Create FormData to send file
    const formData = new FormData();
    formData.append('file', file);
    if (bucket) {
      formData.append('bucket', bucket);
    }
    if (folder) {
      formData.append('folder', folder);
    }

    // Upload file to backend API
    const response = await api.post<{ url: string; path: string; error?: string }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.error) {
      return {
        url: '',
        path: '',
        error: response.data.error
      };
    }

    return {
      url: response.data.url,
      path: response.data.path || ''
    };
  } catch (error: any) {
    console.error('Upload error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to upload file';
    return {
      url: '',
      path: '',
      error: errorMessage
    };
  }
}

/**
 * Upload multiple files to backend API
 * @param files - Array of files to upload
 * @param bucket - The storage bucket name (optional, for backend reference)
 * @param folder - Optional folder path within the bucket
 * @returns Promise with array of upload results
 */
export async function uploadFiles(
  files: File[],
  bucket: string = 'uploads',
  folder?: string
): Promise<UploadResult[]> {
  const uploadPromises = files.map(file => uploadFile(file, bucket, folder));
  return Promise.all(uploadPromises);
}

/**
 * Delete a file via backend API
 * @param path - The file path in the bucket
 * @param bucket - The storage bucket name (optional, for backend reference)
 */
export async function deleteFile(
  path: string,
  bucket: string = 'uploads'
): Promise<{ error?: string }> {
  try {
    const response = await api.delete<{ error?: string }>('/upload', {
      data: { path, bucket }
    });

    if (response.data.error) {
      return { error: response.data.error };
    }

    return {};
  } catch (error: any) {
    console.error('Delete error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to delete file';
    return { error: errorMessage };
  }
}

