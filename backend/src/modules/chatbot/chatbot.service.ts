import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ChatbotService {
  async getResponse(history: any, message: any) {
    // Access your API key as an environment variable (see "Set up your API key" above)
    console.log(
      "We're in the chatbot service:",
      'History:',
      history,
      'Message:',
      message,
    );
    const genAI = new GoogleGenerativeAI(
      process.env.GOOGLE_GEN_AI_KEY as string,
    );

    console.log('Were about to set the model');
    // The Gemini 1.5 models are versatile and work with multi-turn conversations (like chat)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
    });

    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 100,
      },
    });

    const result = await chat.sendMessage(message);

    console.log('Pasa el send message');

    const response = await result.response;

    console.log('Pasa el response', response);

    const text = response.text();
    console.log(text);

    return text;
  }
}
