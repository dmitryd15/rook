// Utility to call OpenAI API for SBAR generation
// You must set your OpenAI API key in an environment variable or secure store

import Constants from 'expo-constants';
const OPENAI_API_KEY =
  Constants.expoConfig?.extra?.OPENAI_API_KEY ||
  Constants.manifest2?.extra?.OPENAI_API_KEY ||
  Constants.manifest?.extra?.OPENAI_API_KEY ||
  Constants.extra?.OPENAI_API_KEY ||
  '';

export async function generateSBAR(patientData: any): Promise<string> {
  if (!OPENAI_API_KEY) throw new Error('OpenAI API key not set');

  // Compose a prompt from patient data
  const prompt = `You are a medical assistant. Given the following patient data, generate an SBAR (Situation, Background, Assessment, Recommendation) summary.\n\nPatient Data:\n${JSON.stringify(patientData, null, 2)}\n\nSBAR:`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful medical assistant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 400,
      temperature: 0.3
    })
  });

  let data;
  let errorText = '';
  try {
    data = await response.clone().json();
    if (!response.ok) {
      // Try to extract error message from OpenAI response
      if (data && data.error && data.error.message) {
        throw new Error(data.error.message);
      } else {
        throw new Error('Failed to generate SBAR');
      }
    }
  } catch (e: any) {
    try {
      errorText = await response.text();
    } catch {}
    throw new Error(e?.message || errorText || 'Failed to generate SBAR');
  }
  return data.choices?.[0]?.message?.content?.trim() || '';
}
