/*
  # Add generated_image_url column for Gemini-generated images

  1. Changes
    - Add `generated_image_url` (text) column to store the URL of AI-generated images
*/

ALTER TABLE cabphonepay
ADD COLUMN IF NOT EXISTS generated_image_url text;
