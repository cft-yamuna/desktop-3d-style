import { RotateCcw, Send } from 'lucide-react';

interface PreviewScreenProps {
  imageDataUrl: string;
  onRetake: () => void;
  onSubmit: () => void;
}

export default function PreviewScreen({ imageDataUrl, onRetake, onSubmit }: PreviewScreenProps) {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-6">
          <h2 className="text-3xl font-bold text-white text-center">
            Preview Your Capture
          </h2>

          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={imageDataUrl}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="p-8 flex justify-center gap-4">
        <button
          onClick={onRetake}
          className="px-8 py-4 bg-gray-700 text-white rounded-full text-lg font-semibold hover:bg-gray-600 transition-all shadow-xl"
        >
          <RotateCcw className="inline-block w-6 h-6 mr-2" />
          Retake
        </button>

        <button
          onClick={onSubmit}
          className="px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition-all shadow-xl"
        >
          <Send className="inline-block w-6 h-6 mr-2" />
          Submit
        </button>
      </div>
    </div>
  );
}
