import { Test, TestingModule } from '@nestjs/testing';
import { RobotsService } from './robots.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Robot } from './entities/robot.entity';
import { RobotStatus } from './entities/robot-status.entity';
import { NotFoundException } from '@nestjs/common';

describe('RobotsService', () => {
  let service: RobotsService;

  const mockRobotRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockStatusRepo = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RobotsService,
        { provide: getRepositoryToken(Robot), useValue: mockRobotRepo },
        { provide: getRepositoryToken(RobotStatus), useValue: mockStatusRepo },
      ],
    }).compile();

    service = module.get<RobotsService>(RobotsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllRobots', () => {
    it('returns an empty array without querying statuses when there are no robots', async () => {
      mockRobotRepo.find.mockResolvedValue([]);

      const result = await service.findAllRobots();

      expect(result).toEqual([]);
      expect(mockStatusRepo.createQueryBuilder).not.toHaveBeenCalled();
    });

    it('attaches latestStatus: null for a robot with no status readings', async () => {
      const robot = { id: 'robot-1' } as Robot;
      mockRobotRepo.find.mockResolvedValue([robot]);
      mockQueryBuilder.getMany.mockResolvedValue([]); // no statuses at all

      const result = await service.findAllRobots();

      expect(result).toEqual([{ ...robot, latestStatus: null }]);
    });

    it('attaches the correct latest status for a single robot with multiple readings', async () => {
      const robot = { id: 'robot-1' } as Robot;
      const latest = {
        id: 'status-2',
        robotId: 'robot-1',
        lastSeen: new Date('2026-08-14T12:00:00.000Z'),
      } as RobotStatus;

      mockRobotRepo.find.mockResolvedValue([robot]);
      // Only the latest row is returned — DISTINCT ON + ORDER BY lastSeen DESC
      // means the query itself is responsible for narrowing to one row per robot;
      // this test asserts the service trusts and maps that result correctly.
      mockQueryBuilder.getMany.mockResolvedValue([latest]);

      const result = await service.findAllRobots();

      expect(result).toEqual([{ ...robot, latestStatus: latest }]);
    });

    it('maps each robot to its own latest status without cross-contamination', async () => {
      const robotA = { id: 'robot-a' } as Robot;
      const robotB = { id: 'robot-b' } as Robot;
      const latestA = { id: 'status-a', robotId: 'robot-a' } as RobotStatus;
      const latestB = { id: 'status-b', robotId: 'robot-b' } as RobotStatus;

      mockRobotRepo.find.mockResolvedValue([robotA, robotB]);
      mockQueryBuilder.getMany.mockResolvedValue([latestA, latestB]);

      const result = await service.findAllRobots();

      expect(result).toEqual([
        { ...robotA, latestStatus: latestA },
        { ...robotB, latestStatus: latestB },
      ]);
    });

    it('handles a mix: one robot with a status, one without', async () => {
      const robotA = { id: 'robot-a' } as Robot;
      const robotB = { id: 'robot-b' } as Robot;
      const latestA = { id: 'status-a', robotId: 'robot-a' } as RobotStatus;

      mockRobotRepo.find.mockResolvedValue([robotA, robotB]);
      mockQueryBuilder.getMany.mockResolvedValue([latestA]); // nothing for robot-b

      const result = await service.findAllRobots();

      expect(result).toEqual([
        { ...robotA, latestStatus: latestA },
        { ...robotB, latestStatus: null },
      ]);
    });

    it('queries statuses scoped to the fetched robot ids', async () => {
      const robots = [{ id: 'robot-a' }, { id: 'robot-b' }] as Robot[];
      mockRobotRepo.find.mockResolvedValue(robots);
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.findAllRobots();

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'status.robotId IN (:...ids)',
        { ids: ['robot-a', 'robot-b'] },
      );
    });

    describe('findStatusHistory — pagination', () => {
      const mockRobot = { id: 'robot-1' } as Robot;

      beforeEach(() => {
        mockRobotRepo.findOne.mockResolvedValue(mockRobot);
        mockStatusRepo.findAndCount.mockResolvedValue([[], 0]);
      });

      it('throws NotFoundException when the robot does not exist', async () => {
        mockRobotRepo.findOne.mockResolvedValue(null);

        await expect(service.findStatusHistory('missing', {})).rejects.toThrow(
          NotFoundException,
        );
      });

      it('applies default page (1) and limit (20) when the query omits them', async () => {
        const result = await service.findStatusHistory('robot-1', {});

        expect(mockStatusRepo.findAndCount).toHaveBeenCalledWith(
          expect.objectContaining({ skip: 0, take: 20 }),
        );
        expect(result.page).toBe(1);
        expect(result.limit).toBe(20);
      });

      it('computes skip = 0 for page 1 regardless of limit', async () => {
        await service.findStatusHistory('robot-1', { page: 1, limit: 15 });

        expect(mockStatusRepo.findAndCount).toHaveBeenCalledWith(
          expect.objectContaining({ skip: 0, take: 15 }),
        );
      });

      it('computes skip correctly for page > 1', async () => {
        // page 3, limit 10 -> skip (3-1)*10 = 20
        await service.findStatusHistory('robot-1', { page: 3, limit: 10 });

        expect(mockStatusRepo.findAndCount).toHaveBeenCalledWith(
          expect.objectContaining({ skip: 20, take: 10 }),
        );
      });

      it('computes skip correctly for a non-default, non-round page/limit combo', async () => {
        // page 4, limit 7 -> skip (4-1)*7 = 21
        await service.findStatusHistory('robot-1', { page: 4, limit: 7 });

        expect(mockStatusRepo.findAndCount).toHaveBeenCalledWith(
          expect.objectContaining({ skip: 21, take: 7 }),
        );
      });

      it('uses the provided limit as-is when only limit is given', async () => {
        await service.findStatusHistory('robot-1', { limit: 5 });

        expect(mockStatusRepo.findAndCount).toHaveBeenCalledWith(
          expect.objectContaining({ skip: 0, take: 5 }),
        );
      });

      it('returns page and limit echoed back in the response shape', async () => {
        const readings = [{ id: 's1' }] as RobotStatus[];
        mockStatusRepo.findAndCount.mockResolvedValue([readings, 1]);

        const result = await service.findStatusHistory('robot-1', {
          page: 2,
          limit: 5,
        });

        expect(result).toEqual({ data: readings, total: 1, page: 2, limit: 5 });
      });

      it('orders results by lastSeen descending', async () => {
        await service.findStatusHistory('robot-1', {});

        expect(mockStatusRepo.findAndCount).toHaveBeenCalledWith(
          expect.objectContaining({ order: { lastSeen: 'DESC' } }),
        );
      });
    });
  });
});
