
import React from 'react';
import { SolutionType } from '../types';

interface EditorProps {
  code: string;
  setCode: (code: string) => void;
  solutionType: SolutionType;
}

const Editor: React.FC<EditorProps> = ({ code, setCode, solutionType }) => {
  const getPlaceholder = () => {
    switch (solutionType) {
      case SolutionType.POWER_APPS:
        return 'Filter(MyDataSource, Status = "Active")';
      case SolutionType.POWER_AUTOMATE:
        return '{\n  "inputs": { ... }\n}';
      case SolutionType.POWER_BI:
        return 'Total Sales = SUM(Sales[Amount])';
      default:
        return 'Paste your code here...';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
          {solutionType} Source
        </span>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={getPlaceholder()}
        className="flex-1 w-full bg-slate-900 text-slate-100 p-6 focus:outline-none focus:ring-0 resize-none code-font text-sm leading-relaxed scrollbar-thin scrollbar-thumb-slate-700"
        spellCheck={false}
      />
    </div>
  );
};

export default Editor;
