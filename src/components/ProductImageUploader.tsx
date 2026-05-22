import React, { useCallback, useRef, useState } from 'react';
import { uploadProductImage, deleteProductImage, getPublicUrl } from '@/lib/storage';
import { X, Trash, Upload, ArrowLeft, ArrowRight } from 'lucide-react';

interface UploadItem {
  path?: string;
  preview?: string;
  uploading: boolean;
  progress: number;
}

interface Props {
  value?: string[];
  onChange?: (imgs: string[]) => void;
  onUploadingChange?: (uploading: boolean) => void;
  vendor?: string;
}

const MAX_SIZE = 6 * 1024 * 1024; // 6MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

const ProductImageUploader: React.FC<Props> = ({ value = [], onChange, onUploadingChange, vendor }) => {
  const [items, setItems] = useState<UploadItem[]>(() =>
    (value || []).map((v) => ({ path: v, uploading: false, progress: 100 }))
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  const pushChange = (next: UploadItem[]) => {
    setItems(next);
    onChange?.(next.filter((item) => !item.uploading).map((item) => item.path || '').filter(Boolean));
    onUploadingChange?.(next.some((item) => item.uploading));
  };

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const folder = vendor ? vendor.toLowerCase().replace(/\s+/g, '-') : undefined;
    const newItems = [...items];
    for (const f of Array.from(files)) {
      if (!ALLOWED.includes(f.type)) {
        alert('Only JPG, PNG, WEBP allowed');
        continue;
      }
      if (f.size > MAX_SIZE) {
        alert('File too large (max 6MB)');
        continue;
      }
      const preview = URL.createObjectURL(f);
      const entry: UploadItem = { preview, uploading: true, progress: 0 };
      newItems.push(entry);
      pushChange(newItems);

      try {
        const res = await uploadProductImage(f, folder);
        entry.path = res.path;
        entry.preview = undefined;
        entry.uploading = false;
        entry.progress = 100;
        pushChange([...newItems]);
      } catch (err) {
        alert('Upload failed');
        const idx = newItems.indexOf(entry);
        if (idx >= 0) newItems.splice(idx, 1);
        pushChange([...newItems]);
      }
    }
  }, [items, vendor]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeAt = async (i: number) => {
    const it = items[i];
    if (it) {
      try {
        if (it.path) await deleteProductImage(it.path);
      } catch (e) {}
      if (it.preview) {
        URL.revokeObjectURL(it.preview);
      }
      const next = items.filter((_, idx) => idx !== i);
      pushChange(next);
    }
  };

  const move = (i: number, dir: number) => {
    const idx = i + dir;
    if (idx < 0 || idx >= items.length) return;
    const next = [...items];
    const tmp = next[i];
    next[i] = next[idx];
    next[idx] = tmp;
    pushChange(next);
  };

  const inputId = `product-image-input-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-dashed border-2 border-gray-200 p-6 rounded text-center cursor-pointer"
      >
        <label htmlFor={inputId} className="w-full h-full block">
          <input id={inputId} ref={inputRef} type="file" className="hidden" multiple accept="image/*" onChange={(e) => handleFiles(e.target.files)} />
          <div className="flex items-center justify-center gap-3">
            <Upload className="w-5 h-5" />
            <div className="text-sm">Drag & drop images or click to select</div>
          </div>
        </label>
        <div className="text-xs text-gray-500 mt-2">Supports JPG, PNG, WEBP. Max 6MB each.</div>
      </div>

      <div className="grid grid-cols-4 gap-3 mt-4">
        {items.map((it, i) => {
          const displaySrc = it.preview || getPublicUrl(it.path || '') || it.path || '/placeholder.svg';
          return (
            <div key={i} className="relative bg-[#FAFAF8] aspect-square overflow-hidden border">
              <img src={displaySrc} alt="" className="w-full h-full object-cover" />
              <div className="absolute top-1 right-1 flex gap-1">
                <button type="button" onClick={() => move(i, -1)} className="bg-white/80 p-1 rounded"><ArrowLeft className="w-4 h-4" /></button>
                <button type="button" onClick={() => move(i, 1)} className="bg-white/80 p-1 rounded"><ArrowRight className="w-4 h-4" /></button>
                <button type="button" onClick={() => removeAt(i)} className="bg-white/80 p-1 rounded text-red-600"><Trash className="w-4 h-4" /></button>
              </div>
              {it.uploading && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white">Uploading…</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductImageUploader;
