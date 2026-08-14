import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RobotsService } from './robots.service';
import { CreateRobotStatusDto } from './dtos/create-robot-status.dto';

@Controller('robots')
export class RobotsController {
  constructor(private readonly RobotService: RobotsService) {}

  @Get()
  findAll() {
    return this.RobotService.findAllRobots();
  }

  @Post(':id/status')
  createStatus(@Param('id') id: string, @Body() dto: CreateRobotStatusDto) {
    return this.RobotService.createStatus(id, dto);
  }

  @Get(':id/history')
  findStatusHistory() {}
}
