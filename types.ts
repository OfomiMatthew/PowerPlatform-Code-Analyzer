
export enum SolutionType {
  POWER_APPS = 'Power Apps (Power Fx)',
  POWER_AUTOMATE = 'Power Automate (JSON/Logic)',
  POWER_BI = 'Power BI (DAX/M Query)'
}

export interface AnalysisIssue {
  id: string;
  category: 'Logic' | 'Performance' | 'Best Practice' | 'Security' | 'Accessibility';
  severity: 'Critical' | 'Warning' | 'Info';
  title: string;
  description: string;
  recommendation: string;
  snippet?: string;
}

export interface AnalysisResult {
  summary: string;
  score: number;
  issues: AnalysisIssue[];
  optimizedCode: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  type: SolutionType;
  input: string;
  result: AnalysisResult;
}
