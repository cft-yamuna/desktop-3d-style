
interface PreviewScreenProps {
  imageDataUrl: string;
  onRetake: () => void;
  onSubmit: () => void;
}

export default function PreviewScreen({ imageDataUrl, onRetake, onSubmit }: PreviewScreenProps) {
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
          <img
            src={imageDataUrl}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-4" style={{ bottom: '120px' }}>
        <button
          onClick={onRetake}
          className="bg-cover bg-center bg-no-repeat transition-all transform hover:scale-105 shadow-xl"
          style={{
            backgroundImage: 'url(/retake.png)',
            width: '399px',
            height: '102px',
          }}
        >
        </button>

        <button
          onClick={onSubmit}
          className="bg-cover bg-center bg-no-repeat transition-all transform hover:scale-105 shadow-xl"
          style={{
            backgroundImage: 'url(/submit.png)',
       width: '399px',
            height: '102px',
          }}
        >
        </button>
      </div>
    </div>
  );
}
