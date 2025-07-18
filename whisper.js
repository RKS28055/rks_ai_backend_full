import { createReadStream } from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

export async function transcribeAudio(filePath) {
  const formData = new FormData();
  formData.append('file', createReadStream(filePath));
  formData.append('model', 'whisper-1');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Whisper API failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.text;
}
