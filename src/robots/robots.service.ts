import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Robot } from './entities/robot.entity';
import { RobotStatus } from './entities/robot-status.entity';
import { CreateRobotStatusDto } from './dtos/create-robot-status.dto';
import { QueryRobotStatusDto } from './dtos/query-robot-status.dto';

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

  async createStatus(
    robotId: string,
    dto: CreateRobotStatusDto,
  ): Promise<RobotStatus> {
    const robot = await this.robotRepo.findOne({
      where: { id: robotId },
    });

    if (!robot) {
      throw new NotFoundException(`Robot ${robotId} not found`);
    }

    const status = this.statusRepo.create({
      robotId,
      ...dto,
      lastSeen: new Date(dto.lastSeen),
      errorCode: dto.errorCode ?? null,
    });

    return this.statusRepo.save(status);
  }

  async findStatusHistory(
    robotId: string,
    query: QueryRobotStatusDto,
  ): Promise<{
    data: RobotStatus[];
    total: number;
    page: number;
    limit: number;
  }> {
    const robot = await this.robotRepo.findOne({
      where: { id: robotId },
    });

    if (!robot) {
      throw new NotFoundException(`Robot ${robotId} not found`);
    }

    const { page = 1, limit = 20 } = query;

    const [data, total] = await this.statusRepo.findAndCount({
      where: { robotId },
      order: { lastSeen: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }
}
