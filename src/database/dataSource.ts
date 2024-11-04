import configuration from 'config';
import * as entities from 'entities';
import { DataSource } from 'typeorm';
export const ormConfig = async (): Promise<DataSource> => {
  const config = await configuration();
  return new DataSource({
    type: 'mysql',
    synchronize: true,
    host: config.db.host || '127.0.0.1',
    port: +config.db.port || 3306,
    username: config.db.username || 'username',
    password: config.db.password || '',
    database: config.db.database || 'dbname',
    extra: {
      connectionLimit: 50,
      charset: 'utf8mb4',
      timezone: 'Z',
      connectTimeout: 10000,
      queueLimit: 100,
      multipleStatements: false,
    },
    migrationsRun: false,
    entities: Object.values(entities),
    migrations: [],
    subscribers: [],
    migrationsTableName: 'migrations_typeorm',
  });
};
export default ormConfig();
