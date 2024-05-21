import { Test, TestingModule } from '@nestjs/testing';
import { TrainersService } from './trainers.service';

describe('TrainersService', () => {
  let service: TrainersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainersService],
    }).compile();

    service = module.get<TrainersService>(TrainersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
