export type Screen = 'start' | 'capture' | 'preview' | 'processing' | 'output';

export interface Capture {
  id: string;
  image_url: string;
  generated_image_url: string | null;
  gemini_result: string | null;
  created_at: string;
}
