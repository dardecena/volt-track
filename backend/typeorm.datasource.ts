import 'dotenv/config';
import { DataSource } from 'typeorm';
import configuration from './src/config/configuration';
import { RobotStatus } from './src/robots/entities/robot-status.entity';
import { Robot } from './src/robots/entities/robot.entity';


const config = configuration();

export default new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  entities: [Robot, RobotStatus],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migration',
});
