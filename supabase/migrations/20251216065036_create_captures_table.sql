/*
  # Create cabphonepay table for storing image captures and AI results

  1. New Tables
    - `cabphonepay`
      - `id` (uuid, primary key)
      - `image_url` (text) - URL to the captured image in storage
      - `gemini_result` (text) - Result from Gemini API
      - `created_at` (timestamptz)

  2. Storage
    - Create storage bucket 'cabphonepay' for captured images

  3. Security
    - Enable RLS on cabphonepay table
    - Add policies for public access (since no auth is required)
    - Make storage bucket public for image access
*/

CREATE TABLE IF NOT EXISTS cabphonepay (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  gemini_result text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cabphonepay ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert cabphonepay"
  ON cabphonepay FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view cabphonepay"
  ON cabphonepay FOR SELECT
  TO anon
  USING (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('cabphonepay', 'cabphonepay', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can upload to cabphonepay"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'cabphonepay');

CREATE POLICY "Anyone can view cabphonepay files"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'cabphonepay');
