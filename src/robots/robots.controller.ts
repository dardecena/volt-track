import { Controller, Get } from '@nestjs/common';
import { RobotsService } from './robots.service';

@Controller('robots')
export class RobotsController {
  constructor(private readonly RobotService: RobotsService) {}

  @Get()
  findAll() {
    return this.RobotService.findAllRobots();
  }
}
