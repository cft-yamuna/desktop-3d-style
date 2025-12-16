import { Loader2, Sparkles } from 'lucide-react';

export default function ProcessingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="relative">
          <Sparkles className="w-20 h-20 text-blue-400 mx-auto animate-pulse" />
          <Loader2 className="w-20 h-20 text-blue-500 mx-auto animate-spin absolute inset-0" />
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-white">
            Analyzing Your Image
          </h2>
          <p className="text-blue-200 text-lg">
            AI is processing your capture...
          </p>
        </div>

        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
