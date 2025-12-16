import { QRCodeSVG } from 'qrcode.react';

interface OutputScreenProps {
  imageUrl: string;
  generatedImageUrl: string;
  result: string;
  onHome: () => void;
}

export default function OutputScreen({ generatedImageUrl, onHome }: OutputScreenProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(generatedImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `figurine-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(generatedImageUrl, '_blank');
    }
  };

  return (
    <div
      className="h-screen w-screen overflow-hidden relative bg-cover bg-center"
      style={{ backgroundImage: 'url(/bg3.png)' }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">

        {/* Generated Image */}
        <div
          className="rounded-2xl shadow-lg overflow-hidden"
          style={{ width: '720px', height: '900px' }}
        >
          <img
            src={generatedImageUrl}
            alt="AI Generated Figurine"
            className="w-full h-full rounded-lg shadow-md object-cover"
          />
        </div>

        {/* Bottom Section - QR Code and Buttons */}
        <div className="flex items-center gap-10 mt-8 print:hidden">
          {/* QR Code */}
          <div className="bg-white p-4 rounded-xl border-4 border-yellow-400">
            <QRCodeSVG
              value={generatedImageUrl}
              size={180}
              level="H"
              includeMargin={false}
            />
          </div>

          {/* Text and Buttons */}
          <div className="flex flex-col items-start gap-4">
            <p className="text-white text-2xl font-semibold">
              Scan the QR code to<br />download image
            </p>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="bg-cover bg-center bg-no-repeat transition-all transform hover:scale-105 shadow-lg"
              style={{
                backgroundImage: 'url(/download.png)',
                width: '280px',
                height: '70px',
              }}
            >
            </button>

            {/* Restart Button */}
            <button
              onClick={onHome}
              className="bg-cover bg-center bg-no-repeat transition-all transform hover:scale-105 shadow-lg"
              style={{
                backgroundImage: 'url(/restart.png)',
                width: '280px',
                height: '70px',
              }}
            >
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
