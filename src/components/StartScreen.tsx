import { Camera } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: 'url(https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1920)'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      <div className="relative z-10 text-center space-y-8">
        <div className="space-y-4">
          <Camera className="w-24 h-24 text-white mx-auto" strokeWidth={1.5} />
          <h1 className="text-5xl font-bold text-white tracking-tight">
            AI Image Analyzer
          </h1>
          <p className="text-xl text-white/90">
            Capture and analyze images with AI
          </p>
        </div>

        <button
          onClick={onStart}
          className="px-12 py-4 bg-white text-gray-900 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
        >
          Start Capture
        </button>
      </div>
    </div>
  );
}
