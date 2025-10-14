-- Create storage bucket for character images
INSERT INTO storage.buckets (id, name, public)
VALUES ('character-images', 'character-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for character images
CREATE POLICY "Users can view all character images"
ON storage.objects FOR SELECT
USING (bucket_id = 'character-images');

CREATE POLICY "Users can upload their own character images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'character-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own character images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'character-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own character images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'character-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add portrait_url column to characters table
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS portrait_url TEXT;