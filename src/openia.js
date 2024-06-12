import OpenAI from 'openai';
import { createReadStream } from 'fs';
import config from 'config';

class OpenIA {
  roles = {
    ASSISTANT: 'assistant',
    USER: 'user',
    SYSTEM: 'system',
  };

  constructor(apiKey) {
    this.openai = new OpenAI({
      apiKey,
    });
  }

  async chat(messages) {
    try {
      const responce = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
      });

      return responce.choices[0].message;
    } catch (err) {
      console.log('Error gpt chat', err.message);
    }
  }

  async transcription(filePath) {
    try {
      const transcription = await this.openai.audio.transcriptions.create({
        file: createReadStream(filePath),
        model: 'whisper-1',
      });

      return transcription.text;
    } catch (err) {
      console.log('Error while transcription', err);
    }
  }
}

export const openia = new OpenIA(config.get('OPENIA_KEY'));
