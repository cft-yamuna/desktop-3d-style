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
      <div className="absolute inset-0 " />

      <div className="relative z-10 text-center space-y-8">

        <button
          onClick={onStart}
          className="bg-cover bg-center bg-no-repeat transition-all transform hover:scale-105 shadow-2xl"
          style={{
            backgroundImage: 'url(/startbg.png)',
            width: '357.75px',
            height: '102.75px',
            marginTop: '1040px'
          }}
        >
        </button>
      </div>
    </div>
  );
}
