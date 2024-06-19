import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { UsersModule } from './users/users.module';
import { Auth0Service, AuthService } from './services';
import { ConfigModule } from '@nestjs/config';
import { authConfig, dbConfig, nodeConfig } from '@utils/environment';
import { RmqModule } from '@rmq/rmq.module';
import { HealthchecksModule } from '@healthchecks/healthchecks.module';
import { JwtStrategy } from './strategies';

export const AuthModuleMetadata = {
  controllers: [AuthController],
  imports: [
    ConfigModule.forRoot({
      load: [nodeConfig, dbConfig, authConfig],
      cache: true,
      ignoreEnvFile: true,
      isGlobal: true,
    }),
    UsersModule,
    RmqModule,
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    HealthchecksModule,
  ],
  providers: [JwtStrategy, Auth0Service, AuthService],
};

@Module(AuthModuleMetadata)
export class AuthModule {}
