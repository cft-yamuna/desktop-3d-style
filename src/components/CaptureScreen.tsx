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

    // Set canvas to portrait 2:3 ratio
    const targetWidth = 720;
    const targetHeight = 1080;

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Calculate crop to fit portrait ratio
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;

      const videoAspect = videoWidth / videoHeight;
      const targetAspect = targetWidth / targetHeight;

      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = videoWidth;
      let sourceHeight = videoHeight;

      if (videoAspect > targetAspect) {
        // Video is wider, crop sides
        sourceWidth = videoHeight * targetAspect;
        sourceX = (videoWidth - sourceWidth) / 2;
      } else {
        // Video is taller, crop top/bottom
        sourceHeight = videoWidth / targetAspect;
        sourceY = (videoHeight - sourceHeight) / 2;
      }

      ctx.drawImage(
        videoRef.current,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, targetWidth, targetHeight
      );

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
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url(/bg2.png)' }}
      >
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
    <div
      className="h-screen w-screen overflow-hidden relative bg-cover bg-center"
      style={{ backgroundImage: 'url(/bg2.png)' }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative bg-black rounded-2xl overflow-hidden shadow-2xl"
          style={{ width: '781.63px', height: '1170.83px', border: '10px solid #FFCE00' }}
        >
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

      <button
        onClick={startCountdown}
        disabled={!isReady || countdown !== null}
        className="absolute left-1/2 transform -translate-x-1/2 bg-cover bg-center bg-no-repeat transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
        style={{
          backgroundImage: 'url(/capture.png)',
          width: '619px',
          height: '137px',
          bottom: '120px',
        }}
      >
      </button>
    </div>
  );
}
