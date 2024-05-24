import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ChatbotService {
  async getResponse(history: any, message: any) {
    const genAI = new GoogleGenerativeAI(
      process.env.GOOGLE_GEN_AI_KEY as string,
    );

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
    });

    console.log('History sent to API:', history);

    const initialContext = [
      {
        role: 'user',
        parts: [
          {
            text: 'Hi, you are a virtual fitness trainer. Please answer only questions related to gym workouts, exercises, fitness routines, and nutrition.',
          },
        ],
      },
      {
        role: 'model',
        parts: [
          {
            text: 'Hello! I am your virtual fitness trainer. I can help you with questions and advice related to gym workouts, exercises, fitness routines, and nutrition. Please note that I will only respond to questions related to fitness and gym activities. How can I assist you with your fitness goals today?',
          },
        ],
      },
    ];

    const fullHistory = [...initialContext, ...history];

    const chat = model.startChat({
      history: fullHistory,
      generationConfig: {
        maxOutputTokens: 40,
      },
    });

    const result = await chat.sendMessage(message);

    const response = await result.response;

    const text = response.text();
    console.log('Text:', text);

    return text;
  }
}
