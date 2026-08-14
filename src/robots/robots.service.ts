import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Robot } from './entities/robot.entity';
import { RobotStatus } from './entities/robot-status.entity';

@Injectable()
export class RobotsService {
  constructor(
    @InjectRepository(Robot)
    private readonly robotRepo: Repository<Robot>,
    @InjectRepository(RobotStatus)
    private readonly statusRepo: Repository<RobotStatus>,
  ) {}

  async findAllRobots(): Promise<
    Array<Robot & { latestStatus: RobotStatus | null }>
  > {
    const robots = await this.robotRepo.find();
    if (robots.length === 0) return [];

    const latestStatuses = await this.statusRepo
      .createQueryBuilder('status')
      .distinctOn(['status.robotId'])
      .where('status.robotId IN (:...ids)', { ids: robots.map((r) => r.id) })
      .orderBy('status.robotId')
      .addOrderBy('status.lastSeen', 'DESC')
      .getMany();

    const latestByRobotId = new Map(latestStatuses.map((s) => [s.robotId, s]));

    return robots.map((robot) => ({
      ...robot,
      latestStatus: latestByRobotId.get(robot.id) ?? null,
    }));
  }

  async createStatus() {}

  async findStatusHistory() {}
}
