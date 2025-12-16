import { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, AlertCircle } from 'lucide-react';

interface CaptureScreenProps {
  onCapture: (imageDataUrl: string) => void;
}

export default function CaptureScreen({ onCapture }: CaptureScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsReady(true);
      }
    } catch (err) {
      setError('Unable to access camera. Please grant camera permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const doCapture = useCallback(() => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      stopCamera();
      onCapture(imageDataUrl);
    }
  }, [onCapture]);

  const startCountdown = () => {
    if (countdown !== null) return; // Already counting

    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      doCapture();
      setCountdown(null);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, doCapture]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
          <h2 className="text-2xl font-semibold text-white">Camera Access Required</h2>
          <p className="text-gray-400 max-w-md">{error}</p>
          <button
            onClick={startCamera}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-center space-y-3">
                <Camera className="w-12 h-12 text-gray-400 mx-auto animate-pulse" />
                <p className="text-gray-400">Starting camera...</p>
              </div>
            </div>
          )}

          {countdown !== null && countdown > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-9xl font-bold text-white animate-pulse drop-shadow-2xl">
                {countdown}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 flex justify-center">
        <button
          onClick={startCountdown}
          disabled={!isReady || countdown !== null}
          className="group relative px-8 py-4 bg-white text-gray-900 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
        >
          <Camera className="inline-block w-6 h-6 mr-2" />
          {countdown !== null ? `Capturing in ${countdown}...` : 'Capture Photo'}
        </button>
      </div>
    </div>
  );
}
