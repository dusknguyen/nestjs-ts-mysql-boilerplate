import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
/**
 * https://github.com/nodejs/help/issues/2907#issuecomment-671782092
 * https://nodejs.org/api/esm.html#no-__filename-or-__dirname
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();
const ormConfig = new DataSource({
  type: 'mysql',
  synchronize: true,
  host: process.env['DB_HOST'] || '127.0.0.1',
  port: Number(process.env['DB_PORT']) || 3306,
  username: process.env['DB_USER'] || 'username',
  password: process.env['DB_PASSWORD'] || '',
  database: process.env['DB_NAME'] || 'dbname',
  extra: {
    connectionLimit: 50,
    charset: 'utf8mb4',
    timezone: 'Z',
    connectTimeout: 10000,
    queueLimit: 100,
    multipleStatements: false,
  },
  migrationsRun: false,
  subscribers: [],
  migrationsTableName: 'migrations_typeorm',
  entities: [`${__dirname}/../src/entities/**/*.entity.{js,ts}`],
  migrations: [`${__dirname}/../migrations/**/*.{js,ts}`],
});
export default ormConfig;
