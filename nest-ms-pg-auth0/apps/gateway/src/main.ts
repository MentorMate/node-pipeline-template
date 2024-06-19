import fastify from 'fastify';
import fastifyProxy, { FastifyHttpProxyOptions } from '@fastify/http-proxy';

interface MicroserviceData {
  uri: string;
  prefix: string;
}

async function bootstrap() {
  const fastifyServer = fastify({ logger: { level: 'trace' } });

  const proxyData: FastifyHttpProxyOptions[] = [
    { uri: `${process.env.AUTH_API_URL}`, prefix: 'auth' },
    { uri: `${process.env.TODOS_API_URL}`, prefix: 'todos' },
  ].map(
    ({ uri, prefix }: MicroserviceData): FastifyHttpProxyOptions => ({
      upstream: uri,
      prefix: `/:version/${prefix}`,
      rewritePrefix: `/:version/${prefix}`,
    }),
  );

  fastifyServer.get('/', async () => {
    return 'Hello Gateway API';
  });

  for (const proxy of proxyData) {
    fastifyServer.register(fastifyProxy, proxy);
  }

  fastifyServer.listen(
    { port: +`${process.env.PORT ?? 3000}`, host: '0.0.0.0' },
    (err, address) => {
      if (err) throw err;
      fastifyServer.log.info(`Server listening on ${address}`);
    },
  );
}
bootstrap();
