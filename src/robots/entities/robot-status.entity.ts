import { ChargingState } from '../types/charging-state.type';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Robot } from './robot.entity';

@Entity()
export class RobotStatus {
  @PrimaryColumn({ type: 'varchar', length: 5 })
  id: string;

  @ManyToOne(() => Robot)
  @JoinColumn({ name: 'robotId' })
  robot: Robot;

  @Column({ type: 'varchar', length: 5 })
  @Index()
  robotId: string;

  @Column({ type: 'numeric' })
  batteryLevel: number; // 0-100 (%)

  @Column({ type: 'enum', enum: ChargingState })
  chargingState: ChargingState;

  @Column({ type: 'timestamp with time zone' })
  @Index(['robotId', 'lastSeen'])
  lastSeen: Date;

  @Column({ type: 'int', nullable: true })
  errorCode: number | null; // Not null when chargingState === 'error'

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
