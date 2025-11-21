import { exportComprehensiveHistory } from './pdfExport';

export interface ComprehensiveHistory {
  biodata_name?: string;
  biodata_age?: string;
  biodata_sex?: string;
  biodata_residence?: string;
  biodata_religion?: string;
  biodata_admission?: string;
  biodata_informant?: string;
  biodata_ipnumber?: string;
  biodata_lmp?: string;
  biodata_gbd?: string;
  biodata_edd?: string;
  biodata_parity?: string;
  chief_complaints?: string;
  hpi?: string;
  hpi_ros?: string;
  hpi_current_status?: string;
  ros?: string;
  obs_hx?: string;
  gyn_hx?: string;
  past_med_surg?: string;
  personal_socio?: string;
  family_socio?: string;
  birth_hx?: string;
  dev_hx?: string;
  immun_hx?: string;
  feed_hx?: string;
  gen_exam?: string;
  vital_signs?: string;
  gen_signs?: string;
  phys_exam?: string;
  local_exam?: string;
  exec_summary?: string;
  impression?: string;
  diff_diag?: string;
  investigations?: string;
  plan?: string;
}

export const generatePlainTextContent = (history: ComprehensiveHistory, patientName: string): string => {
  const shouldIncludeSection = (section: string, sex?: string): boolean => {
    if (['obs_hx', 'gyn_hx', 'biodata_lmp', 'biodata_edd', 'biodata_gbd', 'biodata_parity'].includes(section)) {
      return sex?.toLowerCase().includes('f') === true;
    }
    return true;
  };

  const formatSection = (title: string, content?: string): string => {
    if (!content || !content.trim()) return '';
    const separator = '='.repeat(80);
    return '\n' + separator + '\n' + title + '\n' + separator + '\n' + content.trim() + '\n';
  };

  const formatSubsection = (title: string, content?: string): string => {
    if (!content || !content.trim()) return '';
    const separator = '-'.repeat(80);
    return '\n' + separator + '\n' + title + '\n' + separator + '\n' + content.trim() + '\n';
  };

  let text = '';
  const titleSeparator = '*'.repeat(80);
  text += titleSeparator + '\n';
  text += patientName.toUpperCase() + ' - CASE\n';
  text += 'COMPREHENSIVE MEDICAL HISTORY\n';
  text += titleSeparator + '\n';

  if (history.biodata_name) {
    const bioSeparator = '='.repeat(80);
    text += '\n\n' + bioSeparator + '\nBIODATA\n' + bioSeparator + '\n';
    const biodata: string[] = [];
    if (history.biodata_name) biodata.push('Name: ' + history.biodata_name);
    if (history.biodata_age) biodata.push('Age: ' + history.biodata_age);
    if (history.biodata_sex) biodata.push('Sex: ' + history.biodata_sex);
    if (history.biodata_residence) biodata.push('Residence: ' + history.biodata_residence);
    if (history.biodata_religion) biodata.push('Religion: ' + history.biodata_religion);
    if (history.biodata_admission) biodata.push('Date of Admission: ' + history.biodata_admission);
    if (history.biodata_ipnumber) biodata.push('IP Number: ' + history.biodata_ipnumber);
    if (history.biodata_informant) biodata.push('Informant: ' + history.biodata_informant);
    if (shouldIncludeSection('biodata_lmp', history.biodata_sex) && history.biodata_lmp)
      biodata.push('LMP: ' + history.biodata_lmp);
    if (shouldIncludeSection('biodata_gbd', history.biodata_sex) && history.biodata_gbd)
      biodata.push('GBD: ' + history.biodata_gbd);
    if (shouldIncludeSection('biodata_edd', history.biodata_sex) && history.biodata_edd)
      biodata.push('EDD: ' + history.biodata_edd);
    if (shouldIncludeSection('biodata_parity', history.biodata_sex) && history.biodata_parity)
      biodata.push('Parity: ' + history.biodata_parity);

    text += biodata.join('\n') + '\n';
  }

  text += formatSection('CHIEF COMPLAINTS', history.chief_complaints);
  text += formatSection('HISTORY OF PRESENT ILLNESS', history.hpi);
  text += formatSubsection('ROS of the Affected Systems', history.hpi_ros);
  text += formatSubsection('Current Status of the Patient', history.hpi_current_status);
  text += formatSection('REVIEW OF SYSTEMS', history.ros);
  text += formatSection('PAST MEDICAL & SURGICAL HISTORY', history.past_med_surg);
  text += formatSection('PERSONAL SOCIOECONOMIC HISTORY', history.personal_socio);
  text += formatSection('FAMILY SOCIOECONOMIC HISTORY', history.family_socio);
  text += formatSection('BIRTH HISTORY', history.birth_hx);
  text += formatSection('DEVELOPMENTAL HISTORY', history.dev_hx);
  text += formatSection('IMMUNIZATION HISTORY', history.immun_hx);
  text += formatSection('FEEDING HISTORY', history.feed_hx);

  if (shouldIncludeSection('obs_hx', history.biodata_sex)) {
    text += formatSection('OBSTETRIC HISTORY', history.obs_hx);
  }

  if (shouldIncludeSection('gyn_hx', history.biodata_sex)) {
    text += formatSection('GYNAECOLOGIC HISTORY', history.gyn_hx);
  }

  text += formatSection('GENERAL EXAMINATION', history.gen_exam);
  text += formatSubsection('General Signs', history.gen_signs);
  text += formatSubsection('Vital Signs', history.vital_signs);
  text += formatSection('PHYSICAL EXAMINATION', history.phys_exam);
  text += formatSection('LOCAL EXAMINATION', history.local_exam);
  text += formatSection('EXECUTIVE SUMMARY', history.exec_summary);
  text += formatSection('IMPRESSION', history.impression);
  text += formatSection('DIFFERENTIAL DIAGNOSES', history.diff_diag);
  text += formatSection('INVESTIGATIONS', history.investigations);
  text += formatSection('PLAN', history.plan);

  const footerSeparator = '*'.repeat(80);
  text += '\n\n' + footerSeparator + '\n';
  text += 'Generated: ' + new Date().toLocaleString() + '\n';
  text += footerSeparator + '\n';

  return text;
};

export const generateComprehensiveHistoryPDF = async (
  history: ComprehensiveHistory,
  patientName: string = 'Patient'
): Promise<void> => {
  if (!history.biodata_name) {
    throw new Error('Patient name is required');
  }

  const textContent = generatePlainTextContent(history, patientName);
  const filename = patientName.replace(/\s+/g, '_') + '_ComprehensiveHistory_' + new Date().toISOString().split('T')[0];

  // Use centralized exporter to convert text -> HTML -> PDF and share
  await exportComprehensiveHistory(textContent, filename);
};