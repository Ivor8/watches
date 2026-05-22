import { createClient } from '@supabase/supabase-js';

const url = 'https://vxxqfscppyianbqkkllr.databasepad.com';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0SWQiOiJ2eHhxZnNjcHB5aWFuYnFra2xsciIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzc5MTExNzc0LCJleHAiOjIwOTQ0NzE3NzQsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.3xJYSKJ9pLajFZ-P6RUnLedCwoev5eYQKtXcOi73638';
const supabase = createClient(url, key);

(async () => {
  const { data, error } = await supabase.from('ecom_products').select('id,name,images').order('created_at', { ascending: false }).limit(5);
  console.log('error', error);
  console.log('data', JSON.stringify(data, null, 2));
})();
