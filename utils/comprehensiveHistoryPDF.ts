/**
 * Lightweight wrapper: delegate to centralized text -> PDF exporter.
 * This file intentionally contains no direct FileSystem/Sharing/Print calls.
 */
import { generatePlainTextContent } from './comprehensiveHistoryPlainText';
import { exportComprehensiveHistory } from './pdfExport';

export const generateComprehensiveHistoryPDF = async (
  history: any,
  patientName: string = 'Patient'
): Promise<void> => {
  if (!history || !history.biodata_name) throw new Error('Patient name is required');
  const text = generatePlainTextContent(history, patientName);
  const filename = patientName.replace(/\s+/g, '_') + '_ComprehensiveHistory_' + new Date().toISOString().split('T')[0];
  await exportComprehensiveHistory(text, filename);
};

export const formatDateForDisplay = (dateStr?: string): string => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    const daySuffix = getDaySuffix(day);
    return day + daySuffix + ' ' + month + ' ' + year;
  } catch {
    return dateStr;
  }
};

const getDaySuffix = (day: number): string => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

