import util from 'node:util';
import { plainToClass } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

export enum NodeEnvironment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export interface Environment {
  // Node
  NODE_ENV: NodeEnvironment;

  // HTTP
  PORT: number;

  // PostgreSQL
  PGHOST: string;
  PGPORT: number;
  PGUSER: string;
  PGPASSWORD: string;
  PGDATABASE: string;

  // JWT
  JWT_SECRET: string;
  JWT_EXPIRATION: number;
}

class EnvironmentVariablesValidator implements Environment {
  @IsEnum(NodeEnvironment)
  NODE_ENV: NodeEnvironment;

  @IsInt()
  @Min(1024)
  @Max(65535)
  PORT: number;

  @IsString()
  @IsNotEmpty()
  PGHOST: string;

  @IsInt()
  @Min(1024)
  @Max(65535)
  PGPORT: number;

  @IsString()
  @IsNotEmpty()
  PGUSER: string;

  @IsString()
  @IsNotEmpty()
  PGPASSWORD: string;

  @IsString()
  @IsNotEmpty()
  PGDATABASE: string;

  @IsString()
  JWT_SECRET: string;

  @IsInt()
  JWT_EXPIRATION: number;
}

export const validateConfig = (
  config: Record<string, unknown>,
): Environment => {
  const validatedConfig = plainToClass(EnvironmentVariablesValidator, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    whitelist: true,
  });

  if (errors.length > 0) {
    throw new Error(util.inspect(errors));
  }

  return validatedConfig;
};