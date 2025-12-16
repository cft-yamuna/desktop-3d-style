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
          className="shadow-lg overflow-hidden"
          style={{ width: '754.05px', height: '1131.07px', marginTop: '80px' }}
        >
          <img
            src={generatedImageUrl}
            alt="AI Generated Figurine"
            className="w-full h-full shadow-md object-cover"
          />
        </div>

        {/* Bottom Section - QR Code and Buttons */}
        <div className="flex items-center gap-10 mt-8 print:hidden">
          {/* QR Code */}
          <div
            className="bg-white flex items-center justify-center overflow-hidden"
            style={{
              width: '299px',
              height: '299px',
              border: '10px solid #FFCE00',
              borderRadius: '15px',
            }}
          >
            <QRCodeSVG
              value={generatedImageUrl}
              size={259}
              level="H"
              includeMargin={false}
            />
          </div>

          {/* Text and Buttons */}
          <div className="flex flex-col items-start gap-4">
            <p className="text-white text-4xl font-semibold">
              Scan the QR code to<br />download image
            </p>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="bg-cover bg-center bg-no-repeat transition-all transform hover:scale-105 shadow-lg"
              style={{
                backgroundImage: 'url(/download.png)',
                width: '399.61px',
                height: '103px',
              }}
            >
            </button>

            {/* Restart Button */}
            <button
              onClick={onHome}
              className="bg-cover bg-center bg-no-repeat transition-all transform hover:scale-105 shadow-lg"
              style={{
                backgroundImage: 'url(/restart.png)',
                width: '399.61px',
                height: '103px',
              }}
            >
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
