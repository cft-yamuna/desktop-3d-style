import { Home, Printer, CheckCircle, Sparkles } from 'lucide-react';

interface OutputScreenProps {
  imageUrl: string;
  generatedImageUrl: string;
  result: string;
  onHome: () => void;
}

export default function OutputScreen({ generatedImageUrl, onHome }: OutputScreenProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center pt-8 pb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Your Figurine is Ready!
          </h1>
          <p className="text-gray-600 mt-2">
            Here is your personalized 3D figurine
          </p>
        </div>

        {/* Generated Image - Full Focus */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500">
            <h2 className="text-xl font-semibold text-white flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6" />
              AI Generated Figurine
            </h2>
          </div>
          <div className="p-6 bg-gray-50">
            <img
              src={generatedImageUrl}
              alt="AI Generated Figurine"
              className="w-full max-w-3xl mx-auto rounded-lg shadow-md"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 pb-8 print:hidden">
          <button
            onClick={handlePrint}
            className="px-8 py-4 bg-gray-900 text-white rounded-full text-lg font-semibold hover:bg-gray-800 transition-all shadow-lg"
          >
            <Printer className="inline-block w-6 h-6 mr-2" />
            Print
          </button>

          <button
            onClick={onHome}
            className="px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg"
          >
            <Home className="inline-block w-6 h-6 mr-2" />
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
