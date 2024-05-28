import { Body, Controller, Post } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  async getResponse(@Body() data: any) {
    const { history, message } = data;

    console.log(
      "We're in the controller:",
      'History:',
      history,
      'Message:',
      message,
    );

    const chatbotMessage = await this.chatbotService.getResponse(
      history,
      message,
    );

    console.log('Este es la data que recibe el front:', chatbotMessage);

    return chatbotMessage;
  }
}
