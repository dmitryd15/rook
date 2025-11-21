import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

/**
 * Converts markdown-style formatting to HTML
 * - Supports: headings (#, ##), **bold**, *italic*
 * - Bolds headers, bold+italicizes subheaders (##)
 * - Italicizes Roman numerals (I, II, III, etc.) when numbered
 */
const markdownToHtml = (text: string): string => {
  if (!text) return '';

  // Escape HTML special characters first
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  // Convert bold and italic markers first
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Convert heading lines: H1 (# ) -> bold header; H2 (## ) -> bold + italic subheader
  // Use multiline flag
  html = html.replace(/^######\s+(.+)$/gim, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gim, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.+)$/gim, '<h4>$1</h4>');
  // H3: make bold
  html = html.replace(/^###\s+(.+)$/gim, '<h3><strong>$1</strong></h3>');
  // H2: bold + italic (subheaders per user request)
  html = html.replace(/^##\s+(.+)$/gim, '<h2><strong><em>$1</em></strong></h2>');
  // H1: title, bold
  html = html.replace(/^#\s+(.+)$/gim, '<h1><strong>$1</strong></h1>');

  // Italicize roman numerals (e.g., I., II., III.) when used as enumerators
  // Match standalone roman numerals of I,V,X,L,C,D,M (1-7 chars) followed by '.' or ')'
  html = html.replace(/\b([IVXLCDM]{1,7})(?=[\.)])/gi, '<em>$1</em>');

  // Convert double newlines into paragraphs (preserve any headings already transformed)
  const parts = html.split(/\n\n+/);
  html = parts
    .map(part => {
      const trimmed = part.trim();
      if (!trimmed) return '';
      // If the part already contains a block-level tag (h1-h6, p, div, ul, ol), keep as-is
      if (/^<(h[1-6]|p|div|ul|ol|table|blockquote)\b/i.test(trimmed)) return trimmed;
      return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('');

  return html;
};

/**
 * Wraps text content in a professional HTML document
 */
const extractTitleFromText = (text: string): string | null => {
  try {
    const nameMatch = text.match(/\*\*Name:\*\*\s*(.+)/i);
    const ageMatch = text.match(/\*\*Age:\*\*\s*(\d+)/i);
    const sexMatch = text.match(/\*\*Sex:\*\*\s*([MFmf])/i);
    if (nameMatch && nameMatch[1]) {
      const name = nameMatch[1].trim();
      const age = ageMatch && ageMatch[1] ? ageMatch[1].trim() : '';
      const sex = sexMatch && sexMatch[1] ? sexMatch[1].toUpperCase().trim() : '';
      const sexSuffix = sex ? sex : '';
      if (age || sexSuffix) return `${name}${age ? ' ' + age : ''}${sexSuffix ? sexSuffix : ''}`;
      return name;
    }
    const h1Match = text.match(/^#\s*(.+)/m);
    if (h1Match && h1Match[1]) return h1Match[1].trim();
  } catch {
    // ignore
  }
  return null;
};

const buildHtmlDocument = (textData: string): string => {
  const htmlContent = markdownToHtml(textData);
  const timestamp = new Date().toLocaleString();
  const titleOverride = extractTitleFromText(textData) || 'Comprehensive History';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Comprehensive History</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #1a1a1a;
      padding: 40px;
      background-color: #ffffff;
      max-width: 900px;
      margin: 0 auto;
    }
    .header {
      border-bottom: 2px solid #0a7ea4;
      padding-bottom: 16px;
      margin-bottom: 24px;
      text-align: center;
    }
    .header h1 {
      font-size: 24px;
      color: #0a7ea4;
      margin-bottom: 8px;
      font-weight: 600;
    }
    .timestamp {
      font-size: 12px;
      color: #888;
      font-style: italic;
    }
    .content {
      font-size: 12pt;
      line-height: 1.8;
      text-align: justify;
    }
    .content p {
      margin-bottom: 12px;
    }
    .content strong {
      font-weight: 600;
      color: #0a5a7a;
    }
    .content em {
      font-style: italic;
      color: #555;
    }
    .footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #ddd;
      font-size: 10px;
      color: #999;
      text-align: center;
    }
    @page {
      margin: 20mm;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${titleOverride}</h1>
    <p class="timestamp">Generated on ${timestamp}</p>
  </div>
  <div class="content">
    ${htmlContent}
  </div>
  <div class="footer">
    <p>This document was automatically generated from patient medical records.</p>
  </div>
</body>
</html>
  `.trim();
};

/**
 * Exports comprehensive history text as a PDF file and shares it
 * 
 * @param textData - The raw text data to export (supports markdown formatting)
 * @param filename - Optional filename for the export (without .pdf extension)
 */
export const exportComprehensiveHistory = async (
  textData: string,
  filename: string = 'ComprehensiveHistory'
): Promise<void> => {
  try {
    if (!textData || textData.trim().length === 0) {
      Alert.alert('Error', 'No data to export.');
      return;
    }

    // Build HTML from text data
    const htmlContent = buildHtmlDocument(textData);

    console.log('Generating PDF from text data...');

    // Generate PDF file using expo-print
    const pdf = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    console.log('PDF generated successfully at:', pdf.uri);

    // Share the PDF file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdf.uri, {
        mimeType: 'application/pdf',
        dialogTitle: `Share ${filename}`,
      });
    } else {
      Alert.alert('Success', `PDF generated at: ${pdf.uri}`);
    }
  } catch (error: any) {
    console.error('Error exporting comprehensive history:', error);
    Alert.alert('Error', `Failed to export: ${error.message}`);
  }
};
