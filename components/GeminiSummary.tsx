import React from 'react';
import { Sparkles } from 'lucide-react';

interface GeminiSummaryProps {
  summary: string;
  isLoading: boolean;
}

const GeminiSummary: React.FC<GeminiSummaryProps> = ({ summary, isLoading }) => {
  return (
    <div className="bg-purple-900/30 border border-purple-500/50 p-6 rounded-2xl backdrop-blur-md shadow-lg">
      <div className="flex items-center mb-3">
        <Sparkles className="h-6 w-6 text-purple-300 mr-3" />
        <h3 className="text-xl font-bold text-purple-200">AI Summary</h3>
      </div>
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="h-2.5 w-2.5 bg-purple-300 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
          <div className="h-2.5 w-2.5 bg-purple-300 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
          <div className="h-2.5 w-2.5 bg-purple-300 rounded-full animate-pulse"></div>
          <span className="text-purple-300/80">Generating summary...</span>
        </div>
      ) : (
        <p className="text-purple-200/90 leading-relaxed">{summary}</p>
      )}
    </div>
  );
};

export default GeminiSummary;
