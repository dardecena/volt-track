import { Module } from '@nestjs/common';
import { RobotsController } from './robots.controller';
import { RobotsService } from './robots.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Robot } from './entities/robot.entity';
import { RobotStatus } from './entities/robot-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Robot, RobotStatus])],
  exports: [TypeOrmModule],
  controllers: [RobotsController],
  providers: [RobotsService],
})
export class RobotsModule {}
