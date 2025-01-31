import '@database/extensions/knex/register';
import 'reflect-metadata';

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(process.cwd(), '.env.test'),
  override: true,
});
