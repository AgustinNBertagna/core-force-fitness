import { Body, Controller, Post } from '@nestjs/common';
import { RateService } from './rate.service';
import { Rate } from 'src/dtos/rate.dto';

@Controller('rate')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Post()
  async addRate(@Body() rateData: Rate) {
    const { rate, description, userId } = rateData;
    await this.rateService.addRate(rate, description, userId);
  }
}
