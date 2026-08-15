import { ChargingState } from '../types/charging-state.type';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Robot } from './robot.entity';
import { numericTransformer } from '../../common/transformers/numeric.transformer';

@Entity()
export class RobotStatus {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Robot)
  @JoinColumn({ name: 'robotId' })
  robot!: Robot;

  @Column({ type: 'varchar', length: 5 })
  @Index()
  robotId!: string;

  @Column({ type: 'numeric', transformer: numericTransformer })
  batteryLevel!: number; // 0-100 (%)

  @Column({ type: 'enum', enum: ChargingState })
  chargingState!: ChargingState;

  @Column({ type: 'timestamp with time zone' })
  lastSeen!: Date;

  @Column({ type: 'int', nullable: true })
  errorCode!: number | null; // Not null when chargingState === 'error'

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;
}
