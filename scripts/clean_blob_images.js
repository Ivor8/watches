import { createClient } from '@supabase/supabase-js';

const url = 'https://vxxqfscppyianbqkkllr.databasepad.com';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0SWQiOiJ2eHhxZnNjcHB5aWFuYnFra2xsciIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzc5MTExNzc0LCJleHAiOjIwOTQ0NzE3NzQsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.3xJYSKJ9pLajFZ-P6RUnLedCwoev5eYQKtXcOi73638';
const supabase = createClient(url, key);

(async () => {
  console.log('Scanning products for blob/data/file preview URLs...');
  const { data, error } = await supabase.from('ecom_products').select('id, images');
  if (error) {
    console.error('Error fetching products', error);
    process.exit(1);
  }
  const updates = [];
  for (const p of data || []) {
    const imgs = (p.images || []) as string[];
    const cleaned = imgs.filter((s) => s && !s.startsWith('blob:') && !s.startsWith('data:') && !s.startsWith('file:'));
    if (cleaned.length !== imgs.length) {
      console.log(`Cleaning product ${p.id}: removing ${imgs.length - cleaned.length} preview URLs`);
      updates.push({ id: p.id, images: cleaned });
      await supabase.from('ecom_products').update({ images: cleaned }).eq('id', p.id);
    }
  }
  console.log('Done. Updated', updates.length, 'products.');
})();
