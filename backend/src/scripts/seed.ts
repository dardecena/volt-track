import { NestFactory } from '@nestjs/core';
import { Repository } from 'typeorm';
import { Robot } from '../robots/entities/robot.entity';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RobotStatus } from '../robots/entities/robot-status.entity';
import { ChargingState } from '../robots/types/charging-state.type';

const ID_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no O/0, I/1

function generateShortId(length = 5): string {
  let id = '';
  for (let i = 0; i < length; i++) {
    id += ID_ALPHABET[Math.floor(Math.random() * ID_ALPHABET.length)];
  }
  return id;
}

function generateUniqueShortIds(count: number, length = 5): string[] {
  const ids = new Set<string>();
  while (ids.size < count) {
    ids.add(generateShortId(length));
  }
  return Array.from(ids);
}

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const robotRepo = app.get<Repository<Robot>>(getRepositoryToken(Robot));
  const statusRepo = app.get<Repository<RobotStatus>>(
    getRepositoryToken(RobotStatus),
  );

  console.log('Seeding robots...');

  const robotIds = generateUniqueShortIds(11);
  const robots = await robotRepo.save(
    robotRepo.create(robotIds.map((id) => ({ id }))), // 10 robots
  );

  console.log(`Created ${robots.length} robots`);
  console.log('Seeding status history...');

  const chargingStates = Object.values(ChargingState);
  let totalStatuses = 0;

  for (const robot of robots) {
    const readingCount = 20;

    const readings = Array.from({ length: readingCount }, (_, i) => {
      const chargingState =
        chargingStates[Math.floor(Math.random() * chargingStates.length)];

      return statusRepo.create({
        robotId: robot.id,
        batteryLevel: Math.floor(Math.random() * 100), // 0-100
        chargingState,
        lastSeen: new Date(Date.now() - i * 60_000), // 1 min apart, most recent first
        errorCode: chargingState === ChargingState.ERROR ? 500 : null,
      });
    });

    await statusRepo.save(readings);
    totalStatuses += readings.length;
  }

  console.log(`Created ${totalStatuses} status entries`);
  console.log('Seeding complete');

  await app.close();
}

seed().catch((err) => {
  console.error('Seeding failed', err);
  process.exit(1);
});
