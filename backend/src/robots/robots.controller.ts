import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { RobotsService } from './robots.service';
import { CreateRobotStatusDto } from './dtos/create-robot-status.dto';
import { QueryRobotStatusDto } from './dtos/query-robot-status.dto';

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
  findStatusHistory(
    @Param('id') id: string,
    @Query() query: QueryRobotStatusDto,
  ) {
    return this.RobotService.findStatusHistory(id, query);
  }
}
