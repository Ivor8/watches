-- Migration: convert ecom_products.images to text[] if stored as comma-separated text
-- Run this with psql or supabase migration tooling.
BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ecom_products' AND column_name='images') THEN
    ALTER TABLE ecom_products ADD COLUMN images text[];
  END IF;
EXCEPTION WHEN others THEN
  -- ignore
END
$$;

-- Try to convert text -> text[] safely (if images currently text containing comma-separated URLs)
ALTER TABLE ecom_products
  ALTER COLUMN images TYPE text[]
  USING (
    CASE
      WHEN pg_typeof(images) = 'text'::regtype THEN string_to_array(images, ',')
      ELSE images
    END
  );

COMMIT;
