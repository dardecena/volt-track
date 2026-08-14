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

  async findAllRobots(): Promise<Robot[]> {
    return this.robotRepo.find();
  }

  async createStatus() {}

  async findStatusHistory() {}
}
