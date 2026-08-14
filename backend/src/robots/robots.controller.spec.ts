import { Test, TestingModule } from '@nestjs/testing';
import { RobotsController } from './robots.controller';
import { RobotsService } from './robots.service';

describe('RobotsController', () => {
  let controller: RobotsController;
  let service: jest.Mocked<RobotsService>;

  const mockRobotsService = {
    findAllRobots: jest.fn(),
    createStatus: jest.fn(),
    findStatusHistory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RobotsController],
      providers: [{ provide: RobotsService, useValue: mockRobotsService }],
    }).compile();

    controller = module.get<RobotsController>(RobotsController);
    service = module.get(RobotsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
