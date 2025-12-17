import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import StartScreen from './components/StartScreen';
import CaptureScreen from './components/CaptureScreen';
import PreviewScreen from './components/PreviewScreen';
import ProcessingScreen from './components/ProcessingScreen';
import OutputScreen from './components/OutputScreen';
import { supabase } from './lib/supabase';
import type { Screen } from './types';

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('start');
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<string>('');

  const handleStart = () => {
    setCurrentScreen('capture');
  };

  const handleCapture = (imageDataUrl: string) => {
    setCapturedImage(imageDataUrl);
    setCurrentScreen('preview');
  };

  const handleRetake = () => {
    setCapturedImage('');
    setCurrentScreen('capture');
  };

  const handleSubmit = async () => {
    setCurrentScreen('processing');

    const figurinePrompt = `Generate the output image in PORTRAIT orientation (4:6 aspect ratio, taller than wide).

Create a HYPER-REALISTIC, 8K resolution close-up photograph of a premium custom figurine placed on a desk.

THE FIGURINE:

It must look EXACTLY like the person in the photo — capturing precise facial features, skin texture, hairstyle, and outfit with uncanny resemblance.

The figure has a high-quality hand-painted resin finish with realistic shading and textures.

It stands on a simple, round, clear acrylic base.

THE ENVIRONMENT:

The setting is a realistic workspace.

Behind the figure, a computer monitor displays 3D sculpting software showing the digital model of the same person.

THE TENT CARD (CRITICAL ELEMENT):

Next to the figurine, place a premium TENT CARD (A-frame tabletop display stand).

The tent card must have PhonePe branding with the EXACT official logo:
- At the top of the tent card, display the PhonePe logo consisting of:
  - The "पे" (Pe) symbol icon in solid purple/violet color (#5F259F)
  - Next to it, the text "PhonePe" in clean white letters on a dark purple background
- The logo must be EXACTLY as the official PhonePe brand - no redesign, no stylization, no artistic interpretation
- Maintain exact proportions, typography, icon shape, spacing, and colors of the original logo
- The logo should appear as a clean, flat, professionally printed logo

The tent card should have:
- Premium matte or glossy cardstock finish
- Clean A-frame/triangular tent card shape standing upright
- Professional print quality with sharp edges
- Realistic paper texture and subtle shadows
- The PhonePe purple (#5F259F) as the primary brand color accent

TENT CARD CONTENT LAYOUT (top to bottom):
1. PhonePe logo at the very top (as described above)
2. Below the logo, display the USER'S PHOTO/IMAGE prominently on the tent card
   - The user's face/image should be clearly visible and recognizable
   - It should look like a professionally printed photo on the card
   - The image should be well-framed and centered on the tent card

The tent card serves as a personalized branded promotional material featuring both PhonePe branding and the user's image.`;

    try {
      // Get base64 from captured image
      const base64Image = capturedImage.split(',')[1];

      // Use Google GenAI SDK with gemini-3-pro-image-preview model
      const contents = [
        {
          role: 'user' as const,
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image,
              },
            },
            {
              text: figurinePrompt,
            },
          ],
        },
      ];

      console.log('Calling Gemini API with gemini-3-pro-image-preview model...');

      const response = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash-image-preview',
        config: {
          responseModalities: ['IMAGE', 'TEXT'],
        },
        contents,
      });

      let generatedImageBase64 = '';
      let generatedImageMimeType = 'image/png';
      let geminiResult = '';

      // Process streaming response
      for await (const chunk of response) {
        if (!chunk.candidates || !chunk.candidates[0]?.content?.parts) {
          continue;
        }

        for (const part of chunk.candidates[0].content.parts) {
          if (part.inlineData) {
            generatedImageBase64 = part.inlineData.data || '';
            generatedImageMimeType = part.inlineData.mimeType || 'image/png';
            console.log('Received image from Gemini');
          } else if (part.text) {
            geminiResult += part.text;
            console.log('Received text:', part.text);
          }
        }
      }

      if (!generatedImageBase64) {
        console.error('No image in response');
        throw new Error('No image was generated by Gemini.');
      }

      // Upload captured image to Supabase storage
      const capturedBlob = await (await fetch(capturedImage)).blob();
      const capturedFileName = `capture-${Date.now()}.jpg`;

      const { data: capturedUploadData, error: capturedUploadError } = await supabase.storage
        .from('cabphonepay')
        .upload(capturedFileName, capturedBlob, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
        });

      if (capturedUploadError) throw capturedUploadError;

      const { data: { publicUrl: capturedPublicUrl } } = supabase.storage
        .from('cabphonepay')
        .getPublicUrl(capturedUploadData.path);

      // Convert generated image base64 to blob and upload
      const generatedImageBytes = Uint8Array.from(atob(generatedImageBase64), c => c.charCodeAt(0));
      const generatedBlob = new Blob([generatedImageBytes], { type: generatedImageMimeType });
      const generatedFileName = `generated-${Date.now()}.png`;

      const { data: generatedUploadData, error: generatedUploadError } = await supabase.storage
        .from('cabphonepay')
        .upload(generatedFileName, generatedBlob, {
          contentType: generatedImageMimeType,
          cacheControl: '3600',
        });

      if (generatedUploadError) throw generatedUploadError;

      const { data: { publicUrl: generatedPublicUrl } } = supabase.storage
        .from('cabphonepay')
        .getPublicUrl(generatedUploadData.path);

      // Save to database
      const { error: insertError } = await supabase
        .from('cabphonepay')
        .insert({
          image_url: capturedPublicUrl,
          generated_image_url: generatedPublicUrl,
          gemini_result: geminiResult || 'Image generated successfully',
        });

      if (insertError) throw insertError;

      setImageUrl(capturedPublicUrl);
      setGeneratedImageUrl(generatedPublicUrl);
      setAnalysisResult(geminiResult || 'Image generated successfully');
      setCurrentScreen('output');
    } catch (error) {
      console.error('Error processing image:', error);
      alert('An error occurred while processing your image. Please try again.');
      setCurrentScreen('preview');
    }
  };

  const handleHome = () => {
    setCapturedImage('');
    setImageUrl('');
    setGeneratedImageUrl('');
    setAnalysisResult('');
    setCurrentScreen('start');
  };

  return (
    <>
      {currentScreen === 'start' && <StartScreen onStart={handleStart} />}
      {currentScreen === 'capture' && <CaptureScreen onCapture={handleCapture} />}
      {currentScreen === 'preview' && (
        <PreviewScreen
          imageDataUrl={capturedImage}
          onRetake={handleRetake}
          onSubmit={handleSubmit}
        />
      )}
      {currentScreen === 'processing' && <ProcessingScreen />}
      {currentScreen === 'output' && (
        <OutputScreen
          imageUrl={imageUrl}
          generatedImageUrl={generatedImageUrl}
          result={analysisResult}
          onHome={handleHome}
        />
      )}
    </>
  );
}

export default App;
