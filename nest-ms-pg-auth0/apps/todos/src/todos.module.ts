import { AuthGuard } from '@auth/guards/auth.guard';
import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { DatabaseModule } from '@database/database.module';
import { TodosRepository } from './repositories/todos.repository';
import { ConfigModule } from '@nestjs/config';
import { HealthchecksModule } from '@healthchecks/healthchecks.module';
import { AuthModule } from '@auth/auth.module';
import { nodeConfig, dbConfig, authConfig } from '@utils/environment';
import { RmqModule } from '@rmq/rmq.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [TodosController],
  imports: [
    ConfigModule.forRoot({
      load: [nodeConfig, dbConfig, authConfig],
      cache: true,
      ignoreEnvFile: true,
      isGlobal: true,
    }),
    DatabaseModule,
    RmqModule,
    AuthModule,
    HealthchecksModule,
  ],
  providers: [
    TodosService,
    TodosRepository,
    {
      provide: APP_GUARD,
      useExisting: AuthGuard,
    },
    AuthGuard,
  ],
})
export class TodosModule {}
