import { ChargingState } from '../types/charging-state.type';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateRobotStatusDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  batteryLevel: number;

  @IsEnum(ChargingState)
  chargingState: ChargingState;

  @IsDateString()
  lastSeen: string;

  @ValidateIf((o: CreateRobotStatusDto) => o.errorCode !== null)
  @IsNumber()
  errorCode: number | null;
}
