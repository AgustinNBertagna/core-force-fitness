import { Test, TestingModule } from '@nestjs/testing';
import { TrainersController } from './trainers.controller';
import { TrainersService } from './trainers.service';

describe('TrainersController', () => {
  let controller: TrainersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainersController],
      providers: [TrainersService],
    }).compile();

    controller = module.get<TrainersController>(TrainersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
