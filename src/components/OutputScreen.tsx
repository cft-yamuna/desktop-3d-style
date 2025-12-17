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
      style={{ backgroundImage: 'url(/output_screen_bg.png)' }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">

        {/* Generated Image */}
        <div
          className="shadow-lg overflow-hidden"
          style={{ width: '624px', height: '936px', marginTop: '60px' }}
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
              width: '201.83px',
              height: '201.83px',
              border: '6.75px solid #FFCE00',
              borderRadius: '10.13px',
            }}
          >
            <QRCodeSVG
              value={generatedImageUrl}
              size={175}
              level="H"
              includeMargin={false}
            />
          </div>

          {/* Text and Buttons */}
          <div className="flex flex-col items-start gap-4">
            <p className="text-white text-[27px] font-semibold">
              Scan the QR code to<br />download image
            </p>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="bg-cover bg-center bg-no-repeat transition-all transform hover:scale-105 shadow-lg"
              style={{
                backgroundImage: 'url(/download.png)',
                width: '269.73px',
                height: '69.53px',
              }}
            >
            </button>

            {/* Restart Button */}
            <button
              onClick={onHome}
              className="bg-cover bg-center bg-no-repeat transition-all transform hover:scale-105 shadow-lg"
              style={{
                backgroundImage: 'url(/restart.png)',
                width: '269.73px',
                height: '69.53px',
              }}
            >
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
