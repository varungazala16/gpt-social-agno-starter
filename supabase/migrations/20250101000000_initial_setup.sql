-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow authenticated users to upload their own videos
CREATE POLICY "Allow users to upload their own videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'videos' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Allow authenticated users to view their own videos
CREATE POLICY "Allow users to view their own videos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'videos' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Allow authenticated users to update their own videos
CREATE POLICY "Allow users to update their own videos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'videos' AND 
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'videos' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: Allow authenticated users to delete their own videos
CREATE POLICY "Allow users to delete their own videos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'videos' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);
