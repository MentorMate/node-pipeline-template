// register extensions as the very first thing in the entry point
import '@extensions/zod/register';

import { writeFileSync } from 'fs';
import { resolve } from 'path';

import { environmentSchema } from '@utils/environment';
import { generateDocument } from '@utils/openapi';
import { helloWorldRoutes } from '@hello-world';
import { healthcheckRoutes } from '@healthchecks';
import { authRoutes } from '@auth';
import { todoRoutes } from '@todos';

const run = async () => {
  const env = Object.freeze(environmentSchema.parse(process.env));

  const routes = [
    ...helloWorldRoutes,
    ...healthcheckRoutes,
    ...authRoutes,
    ...todoRoutes,
  ];

  const document = generateDocument({
    version: '3.0.3',
    info: {
      version: '1.0.0',
      title: 'To-Do',
      description: 'A To-Do application API',
    },
    routes,
  });

  document.servers = [{ url: `http://localhost:${env.PORT}` }];

  const file = resolve(__dirname, '..', '.openapi', 'openapi.json');
  const data = JSON.stringify(document, null, 2);

  writeFileSync(file, data);

  return file;
};

run().then(console.log).catch(console.error);
