import { INestApplication } from '@nestjs/common';
import { useSocketIo } from 'core/gateway';

/**
 *
 */
export async function gateway(app: INestApplication): Promise<INestApplication> {
  const io = useSocketIo(app);

  app.use((req: any, _: any, next: any) => {
    req.io = io;
    next();
  });

  return app;
}
