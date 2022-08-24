export const config = {
  db: {
    type: process.env.DB_TYPE || 'mysql',
    synchronize: false,
    logging: false,
    host: process.env.DB_HOST || 'masterHost',
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USER || 'username',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'dbname',
    extra: {
      connectionLimit: 30,
    },
    autoLoadEntities: true,
  },
  redis: {
    url: process.env['REDIS_URL'] || 'redis://localhost:6379',
  },
  graphql: {
    debug: false,
    playground: false,
  },
  foo: 'pro-bar',
};
