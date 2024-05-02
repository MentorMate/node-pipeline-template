import '@extensions/zod/register';
import '@extensions/knex/register';

import { createHttpTerminator } from 'http-terminator';

import { environmentSchema } from '@utils/environment';
import { create as createApp } from './app';

function bootstrap() {
  const env = Object.freeze(environmentSchema.parse(process.env));
  const { app, destroy: destroyApp } = createApp(env);

  const server = app.listen(env.PORT, env.HOST, () => {
    console.log(`App is running on http://${env.HOST}:${env.PORT}`);
  });

  // setup graceful shutdown
  const httpTerminator = createHttpTerminator({ server });
  const shutdown = async () => {
    console.log('Shutting down...');
    await httpTerminator.terminate();
    await destroyApp();
  };

  const onSignal = (signal: NodeJS.Signals) => {
    console.log(`${signal} received`);
    shutdown();
  };

  process.on('SIGTERM', onSignal);
  process.on('SIGINT', onSignal);
}

bootstrap();
