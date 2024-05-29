import { Module } from '@nestjs/common';
import { HealthchecksController } from '@healthchecks/healthchecks.controller';

@Module({
  controllers: [HealthchecksController],
})
export class HealthchecksModule {}
