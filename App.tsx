
import React, { useState, useCallback } from 'react';
import { SolutionType, AnalysisResult as AnalysisResultType, HistoryItem } from './types';
import { COLORS, Icons } from './constants';
import Editor from './components/Editor';
import AnalysisResult from './components/AnalysisResult';
import { analyzePowerPlatformCode } from './services/gemini';

const App: React.FC = () => {
  const [solutionType, setSolutionType] = useState<SolutionType>(SolutionType.POWER_APPS);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await analyzePowerPlatformCode(solutionType, code);
      setResult(analysisResult);
      
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: solutionType,
        input: code,
        result: analysisResult
      };
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 10));
    } catch (error) {
      console.error(error);
      alert('Analysis failed. Please check your API key or code input.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setSolutionType(item.type);
    setCode(item.input);
    setResult(item.result);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">PowerLens</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Platform Code Intelligence</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center space-x-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden md:inline">History</span>
          </button>
          
          <div className="h-6 w-px bg-slate-200 mx-2" />

          <select 
            value={solutionType}
            onChange={(e) => setSolutionType(e.target.value as SolutionType)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-all cursor-pointer hover:bg-slate-100"
          >
            <option value={SolutionType.POWER_APPS}>Power Apps</option>
            <option value={SolutionType.POWER_AUTOMATE}>Power Automate</option>
            <option value={SolutionType.POWER_BI}>Power BI</option>
          </select>
          
          <button 
            onClick={handleAnalyze}
            disabled={isLoading || !code.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-all shadow-md active:scale-95 flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Analyze Code</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Editor Pane */}
        <div className="w-1/2 p-6 flex flex-col h-full bg-slate-50 border-r border-slate-200">
           <Editor code={code} setCode={setCode} solutionType={solutionType} />
        </div>

        {/* Results Pane */}
        <div className="w-1/2 p-6 flex flex-col h-full overflow-hidden">
           <AnalysisResult result={result} isLoading={isLoading} />
        </div>

        {/* History Overlay Drawer */}
        {showHistory && (
          <div className="absolute inset-0 z-40 flex">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
            <div className="relative w-80 h-full bg-white shadow-2xl animate-slide-in-right overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-slate-800">Recent Analyses</h2>
                  <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  {history.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">No previous analyses found.</p>
                  ) : (
                    history.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => loadFromHistory(item)}
                        className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            item.type === SolutionType.POWER_APPS ? 'bg-purple-100 text-purple-700' :
                            item.type === SolutionType.POWER_AUTOMATE ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {item.type}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(item.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-700 truncate group-hover:text-blue-700">
                          {item.input.substring(0, 40)}...
                        </p>
                        <div className="flex items-center mt-2 space-x-1">
                           <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-blue-500 h-full" style={{ width: `${item.result.score}%` }} />
                           </div>
                           <span className="text-[10px] font-bold text-slate-500">{item.result.score}%</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>AI Architecture Ready</span>
          </div>
          <div>Gemini-3-Pro Powered</div>
        </div>
        <div className="font-medium">
          Built for Power Platform Excellence &copy; 2024 PowerLens
        </div>
      </footer>

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default App;
