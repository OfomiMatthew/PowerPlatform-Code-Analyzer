
import React from 'react';
import { AnalysisResult as AnalysisResultType, AnalysisIssue } from '../types';
import { Icons } from '../constants';

interface AnalysisResultProps {
  result: AnalysisResultType | null;
  isLoading: boolean;
}

const SeverityBadge: React.FC<{ severity: AnalysisIssue['severity'] }> = ({ severity }) => {
  const colors = {
    Critical: 'bg-red-100 text-red-700 border-red-200',
    Warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Info: 'bg-blue-100 text-blue-700 border-blue-200'
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${colors[severity]}`}>
      {severity}
    </span>
  );
};

const IssueCard: React.FC<{ issue: AnalysisIssue }> = ({ issue }) => (
  <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow group">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
        {issue.title}
      </h4>
      <SeverityBadge severity={issue.severity} />
    </div>
    <div className="text-xs text-slate-500 mb-2 font-medium bg-slate-50 px-2 py-1 rounded inline-block">
      {issue.category}
    </div>
    <p className="text-sm text-slate-600 mb-3">{issue.description}</p>
    <div className="bg-green-50 border-l-4 border-green-500 p-3">
      <p className="text-xs text-green-800 font-semibold mb-1">Recommendation:</p>
      <p className="text-xs text-green-700 leading-relaxed">{issue.recommendation}</p>
    </div>
    {issue.snippet && (
      <div className="mt-3">
        <p className="text-[10px] text-slate-400 font-mono uppercase mb-1">Impacted Area</p>
        <pre className="bg-slate-900 text-slate-300 p-2 rounded text-[11px] code-font overflow-x-auto">
          {issue.snippet}
        </pre>
      </div>
    )}
  </div>
);

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 text-slate-400">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="font-medium animate-pulse">Consulting PowerLens AI Architect...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-8">
        <div className="p-4 bg-slate-100 rounded-full">
           <Icons.Check />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Ready to Analyze</h3>
          <p className="text-sm text-slate-500">Paste your Power Platform code and click "Analyze Code" to get deep insights and optimizations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto scrollbar-thin pr-2 pb-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Health Score</p>
            <h3 className="text-3xl font-black text-slate-800">{result.score}/100</h3>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32" cy="32" r="28"
                stroke="currentColor" strokeWidth="6"
                fill="transparent"
                className="text-slate-100"
              />
              <circle
                cx="32" cy="32" r="28"
                stroke="currentColor" strokeWidth="6"
                fill="transparent"
                strokeDasharray={175.92}
                strokeDashoffset={175.92 - (175.92 * result.score) / 100}
                className={result.score > 80 ? 'text-green-500' : result.score > 50 ? 'text-yellow-500' : 'text-red-500'}
              />
            </svg>
          </div>
        </div>
        <div className="bg-blue-600 p-6 rounded-xl shadow-sm text-white">
          <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">AI Summary</p>
          <p className="text-sm leading-relaxed">{result.summary}</p>
        </div>
      </div>

      {/* Issues Section */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
          <span className="bg-red-500 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs mr-2">
            {result.issues.length}
          </span>
          Key Findings
        </h3>
        <div className="space-y-4">
          {result.issues.length > 0 ? (
            result.issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))
          ) : (
            <div className="p-12 text-center bg-green-50 border border-green-200 rounded-xl">
               <div className="text-green-600 mb-2 font-bold text-lg">Clean Sweep!</div>
               <p className="text-sm text-green-700">No major issues found. Your code looks professional and efficient.</p>
            </div>
          )}
        </div>
      </div>

      {/* Optimized Code Section */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Optimized Version</h3>
        <div className="relative group">
           <pre className="bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-700 text-sm leading-relaxed code-font overflow-x-auto">
             {result.optimizedCode}
           </pre>
           <button 
             onClick={() => navigator.clipboard.writeText(result.optimizedCode)}
             className="absolute top-4 right-4 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors opacity-0 group-hover:opacity-100"
           >
             Copy Code
           </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
