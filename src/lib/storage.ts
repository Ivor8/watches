import { getAuthToken } from '@/lib/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BACKEND_URL = API_BASE_URL.replace(/\/api$/, '');

export async function ensureProductsBucket() {
  // No bucket storage needed for local backend upload.
  return;
}

export function getPublicUrl(path?: string | null) {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BACKEND_URL}${path}`;
}

export async function uploadProductImage(file: File | Blob, folder?: string) {
  const formData = new FormData();
  formData.append('file', file as Blob);

  const url = new URL(`${BACKEND_URL}/api/uploads`);
  url.searchParams.append('type', 'products');
  if (folder) {
    url.searchParams.append('folder', folder);
  }

  const token = getAuthToken();
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(error.message || 'Upload failed');
  }

  const data = await response.json();
  return { path: data.path, publicUrl: data.publicUrl };
}

export async function deleteProductImage(path: string) {
  if (!path) return;
  if (path.startsWith('http://') || path.startsWith('https://')) return;

  const url = new URL(`${BACKEND_URL}/api/uploads`);
  url.searchParams.append('path', path);

  const token = getAuthToken();
  await fetch(url.toString(), {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export default {
  ensureProductsBucket,
  getPublicUrl,
  uploadProductImage,
  deleteProductImage,
};
