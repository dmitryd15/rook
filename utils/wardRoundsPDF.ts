import { exportComprehensiveHistory } from './pdfExport';

interface WardRound {
  createdAt: string;
  doctor?: string;
  complaints?: string;
  onExamination?: string;
  systemicExamination?: string;
  assessment?: string;
  vitalBP?: string;
  vitalSPO2?: string;
  vitalRR?: string;
  vitalPulse?: string;
  vitalTemp?: string;
  text?: string;
  todos?: Array<{
    title: string;
    type: string;
    details?: string;
    completed?: boolean;
  }>;
}

interface PatientInfo {
  firstName: string;
  lastName: string;
  age: string;
  ageMode: string;
  sex: string;
  diagnosis: string;
  ward: string;
  bedNumber: string;
  ipNumber: string;
}

const formatDateFull = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('en-US', options);
  } catch {
    return dateStr;
  }
};

const formatTextAsHTML = (text: string): string => {
  if (!text) return '';
  // Handle newlines and preserve formatting
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)
    .map(line => `<p style="margin: 4px 0;">${line}</p>`)
    .join('');
};

export const generateWardRoundsPDF = async (
  wardRounds: WardRound[],
  patientInfo: PatientInfo,
  selectedIndices?: number[]
) => {
  // Filter ward rounds if specific indices are provided
  let roundsToExport = wardRounds;
  if (selectedIndices && selectedIndices.length > 0) {
    roundsToExport = wardRounds.filter((_, idx) => selectedIndices.includes(idx));
  }

  if (!roundsToExport.length) {
    throw new Error('No ward rounds to export');
  }

  // Group by date
  const groupedByDate: { [key: string]: (WardRound & { index: number })[] } = {};
  roundsToExport.forEach((wr, idx) => {
    const dateKey = new Date(wr.createdAt).toISOString().split('T')[0];
    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = [];
    }
    groupedByDate[dateKey].push({ ...wr, index: idx });
  });

  const sortedDates = Object.keys(groupedByDate).sort().reverse();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.5;
          color: #333;
          padding: 40px;
          background: white;
        }
        .report-title {
          text-align: center;
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
          text-transform: uppercase;
          border-bottom: 3px solid #1976d2;
          padding-bottom: 12px;
        }
        .patient-info {
          background-color: #f0f4f8;
          padding: 15px;
          margin-bottom: 25px;
          border-radius: 8px;
          border-left: 5px solid #1976d2;
        }
        .patient-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          font-size: 13px;
        }
        .info-item {
          margin-bottom: 4px;
        }
        .info-label {
          font-weight: bold;
          color: #1976d2;
          display: inline;
        }
        .info-value {
          display: inline;
          margin-left: 4px;
        }
        .date-section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .date-header {
          font-size: 18px;
          font-weight: bold;
          color: #fff;
          background-color: #1976d2;
          padding: 12px 15px;
          margin-bottom: 15px;
          border-radius: 6px;
          border-left: 5px solid #0d47a1;
        }
        .ward-round-card {
          background-color: #f7fafd;
          border-left: 4px solid #1976d2;
          border-radius: 6px;
          padding: 18px;
          margin-bottom: 16px;
          page-break-inside: avoid;
        }
        .round-header {
          font-size: 15px;
          font-weight: bold;
          color: #1976d2;
          margin-bottom: 12px;
          border-bottom: 2px solid #e0e0e0;
          padding-bottom: 8px;
        }
        .section-title {
          font-size: 13px;
          font-weight: bold;
          color: #1976d2;
          margin-top: 12px;
          margin-bottom: 6px;
          text-decoration: underline;
        }
        .section-content {
          font-size: 12px;
          line-height: 1.5;
          margin-left: 10px;
          margin-bottom: 10px;
        }
        .vitals-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          font-size: 12px;
          margin-left: 10px;
        }
        .vital-item {
          background-color: #fff;
          padding: 8px;
          border-radius: 4px;
          border-left: 3px solid #2196F3;
        }
        .vital-label {
          font-weight: bold;
          color: #2196F3;
        }
        .todo-list {
          margin-left: 20px;
          font-size: 12px;
        }
        .todo-item {
          margin-bottom: 6px;
          padding: 6px;
          background-color: #fff;
          border-radius: 4px;
          border-left: 3px solid #4caf50;
        }
        .todo-completed {
          text-decoration: line-through;
          color: #888;
          border-left-color: #4caf50;
        }
        .todo-pending {
          color: #d32f2f;
          border-left-color: #ff9800;
        }
        p {
          margin-bottom: 8px;
        }
        h1 { page-break-after: avoid; }
        h2 { page-break-after: avoid; }
        .date-header { page-break-after: avoid; }
      </style>
    </head>
    <body>
      <div class="report-title">Ward Round Report</div>
      
      <div class="patient-info">
        <div class="patient-info-grid">
          <div class="info-item">
            <span class="info-label">Name:</span>
            <span class="info-value">${patientInfo.firstName} ${patientInfo.lastName}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Age:</span>
            <span class="info-value">${patientInfo.age} ${patientInfo.ageMode}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Sex:</span>
            <span class="info-value">${patientInfo.sex}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Ward:</span>
            <span class="info-value">${patientInfo.ward}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Bed:</span>
            <span class="info-value">${patientInfo.bedNumber}</span>
          </div>
          <div class="info-item">
            <span class="info-label">IP Number:</span>
            <span class="info-value">${patientInfo.ipNumber}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Diagnosis:</span>
            <span class="info-value">${patientInfo.diagnosis}</span>
          </div>
        </div>
      </div>

      ${sortedDates.map((dateKey) => {
        const rounds = groupedByDate[dateKey];
        const displayDate = formatDateFull(dateKey);
        
        return `
          <div class="date-section">
            <div class="date-header">${displayDate}</div>
            ${rounds.map((wr) => {
              const vitals = [
                wr.vitalBP ? `<div class="vital-item"><span class="vital-label">BP:</span> ${wr.vitalBP} mmHg</div>` : '',
                wr.vitalPulse ? `<div class="vital-item"><span class="vital-label">Pulse:</span> ${wr.vitalPulse}/min</div>` : '',
                wr.vitalRR ? `<div class="vital-item"><span class="vital-label">RR:</span> ${wr.vitalRR}/min</div>` : '',
                wr.vitalTemp ? `<div class="vital-item"><span class="vital-label">Temp:</span> ${wr.vitalTemp}°C</div>` : '',
                wr.vitalSPO2 ? `<div class="vital-item"><span class="vital-label">SpO2:</span> ${wr.vitalSPO2}%</div>` : '',
              ].filter(v => v).join('');

              return `
                <div class="ward-round-card">
                  <div class="round-header">Ward Round by ${wr.doctor || 'Medical Team'}</div>
                  
                  ${wr.complaints ? `
                    <div class="section-title">Complaints</div>
                    <div class="section-content">${formatTextAsHTML(wr.complaints)}</div>
                  ` : ''}
                  
                  ${wr.onExamination ? `
                    <div class="section-title">On Examination</div>
                    <div class="section-content">${formatTextAsHTML(wr.onExamination)}</div>
                  ` : ''}
                  
                  ${wr.systemicExamination ? `
                    <div class="section-title">Systemic Examination</div>
                    <div class="section-content">${formatTextAsHTML(wr.systemicExamination)}</div>
                  ` : ''}
                  
                  ${vitals ? `
                    <div class="section-title">Vital Signs</div>
                    <div class="vitals-grid">${vitals}</div>
                  ` : ''}
                  
                  ${wr.assessment ? `
                    <div class="section-title">Assessment</div>
                    <div class="section-content">${formatTextAsHTML(wr.assessment)}</div>
                  ` : ''}
                  
                  ${wr.text ? `
                    <div class="section-title">Notes</div>
                    <div class="section-content">${formatTextAsHTML(wr.text)}</div>
                  ` : ''}
                  
                  ${wr.todos && wr.todos.length > 0 ? `
                    <div class="section-title">Action Items / To Do</div>
                    <div class="todo-list">
                      ${wr.todos.map((todo) => `
                        <div class="todo-item ${todo.completed ? 'todo-completed' : 'todo-pending'}">
                          <strong>${todo.title}</strong> (${todo.type})
                          ${todo.details ? ` - ${todo.details}` : ''}
                          ${todo.completed ? ' ✅' : ' ⏳'}
                        </div>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        `;
      }).join('')}
    </body>
    </html>
  `;

  try {
    const filename = `${patientInfo.firstName}_${patientInfo.lastName}_WardRounds_${new Date().toISOString().split('T')[0]}.pdf`;

    // Convert the HTML content to a simple plain-text representation
    const rawText = htmlContent
      .replace(/<br\s*\/?>/gi, '\\n')
      .replace(/<\/(p|div|h1|h2|li|tr|td)>/gi, '\\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .trim();

    // Use the centralized exporter which will call Print.printToFileAsync and Sharing.shareAsync
    await exportComprehensiveHistory(rawText, filename);

    return;
  } catch (error) {
    console.error('Error generating ward rounds PDF:', error);
    throw error;
  }
};
