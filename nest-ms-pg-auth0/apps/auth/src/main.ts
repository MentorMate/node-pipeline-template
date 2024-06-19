import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import compression from '@fastify/compress';
import { AuthModule } from './auth.module';
import { RmqService } from '@rmq/rmq.service';
import { RmqOptions } from '@nestjs/microservices';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ConfigType } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { RequestLoggingInterceptor } from '@utils/interceptors/request-logging.interceptor';
import { ServiceToHttpErrorsInterceptor } from '@utils/interceptors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ErrorLoggingFilter } from '@utils/error-logging.filter';
import { nodeConfig } from '@utils/environment';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AuthModule,
    new FastifyAdapter(),
  );

  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('AUTH', true));
  await app.startAllMicroservices();

  // enables CORS
  app.enableCors();

  // add security HTTP headers
  app.register(
    helmet as unknown as Parameters<NestFastifyApplication['register']>[0],
  );

  // compresses response bodies
  app.register(
    compression as unknown as Parameters<NestFastifyApplication['register']>[0],
  );

  // enable validation globally
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // map application level errors to http errors
  app.useGlobalInterceptors(new ServiceToHttpErrorsInterceptor());

  // setup graceful shutdown
  app.enableShutdownHooks();

  const configService = app.get<ConfigType<typeof nodeConfig>>(nodeConfig.KEY);
  const port = configService.PORT;

  if (configService.REQUEST_LOGGING) {
    app.useGlobalInterceptors(new RequestLoggingInterceptor());
  }

  if (configService.SWAGGER) {
    const config = new DocumentBuilder().setTitle('To-Do Example API').build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/swagger', app, document);
  }

  if (configService.ERROR_LOGGING) {
    const httpAdapterHost = app.get(HttpAdapterHost);
    app.useGlobalFilters(new ErrorLoggingFilter(httpAdapterHost));
  }

  const openPort = process.env.AUTH_API_PORT ?? port;

  await app.listen(openPort, configService.HOST, () => {
    console.log(`App is running on http://${configService.HOST}:${openPort}`);
  });
}
bootstrap();
