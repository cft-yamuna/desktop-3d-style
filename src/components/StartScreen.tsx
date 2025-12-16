import { Camera } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: 'url(/bg.png)'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      <div className="relative z-10 text-center space-y-8">
     
        <button
          onClick={onStart}
          className="bg-cover bg-center bg-no-repeat transition-all transform hover:scale-105 shadow-2xl"
          style={{
            backgroundImage: 'url(/startbg.png)',
            width: '477px',
            height: '137px',
            marginTop: '1120px'
          }}
        >
        </button>
      </div>
    </div>
  );
}
