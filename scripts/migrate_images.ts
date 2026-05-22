import { supabase } from '../src/lib/supabase';

async function run() {
  console.log('Starting images migration (non-destructive)...');
  // ensure images column exists
  // Fetch all products
  const { data: products } = await supabase.from('ecom_products').select('id, images');
  if (!products) {
    console.log('No products found or error fetching products');
    return;
  }
  for (const p of products) {
    const images = (p as any).images;
    if (typeof images === 'string') {
      const arr = images.split(',').map((s: string) => s.trim()).filter(Boolean);
      console.log(`Converting product ${p.id} images to array:`, arr);
      await supabase.from('ecom_products').update({ images: arr }).eq('id', p.id);
    }
  }
  console.log('Migration finished. Note: external image URLs are left as-is. To migrate external URLs into storage run a separate copy script.');
}

run().catch((e) => { console.error(e); process.exit(1); });
