'use strict';

module.exports = (toolbox) => {
  toolbox.installNest = async ({
    projectName,
    authOption,
    framework,
    appDir,
    assetsPath,
    pkgJson,
    envVars,
    isExampleApp,
    projectLanguage,
  }) => {
    const {
      system: { run },
      print: { success, muted },
      filesystem: { copyAsync, removeAsync, renameAsync },
    } = toolbox;

    muted('Installing Nest...');

    try {
      await run(
        `npx @nestjs/cli@9.4.2 new ${projectName} --directory ${projectName} --strict --skip-git --skip-install --package-manager npm`
      );

      const srcDir = isExampleApp
        ? `${assetsPath}/${framework}/example-app/src/`
        : `${assetsPath}/${framework}/${projectLanguage.toLowerCase()}/src/`;

      await removeAsync(`${appDir}/src/`);
      await removeAsync(`${appDir}/test/`);
      await copyAsync(srcDir, `${appDir}/src/`);

      if (isExampleApp) {
        if (authOption === 'auth0') {
          await removeAsync(`${appDir}/src/api/auth`);
          await renameAsync(`${appDir}/src/api/auth0`, 'auth');
        }

        if (authOption === 'jwt') {
          await removeAsync(`${appDir}/src/api/auth0`);
        }
      }

      Object.assign(envVars, {
        HTTP: {
          PORT: 3000,
        },
      });

      Object.assign(pkgJson.dependencies, {
        '@nestjs/platform-fastify': '^9.0.0',
        '@fastify/helmet': '^10.1.1',
        '@fastify/compress': '^6.4.0',
        '@nestjs/config': '^2.3.1',
      });

      Object.assign(pkgJson.scripts, {
        start:
          'node -r dotenv/config ./node_modules/@nestjs/cli/bin/nest.js start',
        'start:debug':
          'node -r dotenv/config ./node_modules/@nestjs/cli/bin/nest.js start --debug --watch',
        'start:dev':
          'node -r dotenv/config ./node_modules/@nestjs/cli/bin/nest.js start --watch',
      });

      // Example Nest app
      if (isExampleApp) {
        Object.assign(pkgJson.dependencies, {
          'class-transformer': '^0.5.1',
          'class-validator': '^0.14.0',
          statuses: '^2.0.1',
          bcrypt: '^5.1.0',
        });

        if (authOption === 'auth0') {
          Object.assign(pkgJson.dependencies, {
            '@nestjs/passport': '^10.0.1',
            'passport-jwt': '^4.0.1',
            'jwks-rsa': '^3.0.1',
          });
        }

        Object.assign(pkgJson.devDependencies, {
          '@nestjs/swagger': '^6.3.0',
        });

        if (authOption === 'auth0') {
          Object.assign(pkgJson.devDependencies, {
            '@types/passport-jwt': '^3.0.9',
          });
        }

        Object.assign(pkgJson.scripts, {
          'openapi:g': 'ts-node scripts/generate-openapi',
          '@fastify/static': '^6.10.2',
          '@golevelup/ts-jest': '^0.4.0',
          typescript: '^4.9.5',
          '@types/statuses': '^2.0.1',
          '@types/bcrypt': '^5.0.0',
          '@types/uuid': '^9.0.1',
          uuid: '^9.0.0',
        });

        await Promise.all([
          copyAsync(
            `${assetsPath}/nest/example-app/.openapi/gitignorefile`,
            `${appDir}/.openapi/.gitignore`
          ),
          copyAsync(
            `${assetsPath}/nest/example-app/docker-compose.yml`,
            `${appDir}/docker-compose.yml`
          ),
          copyAsync(
            `${assetsPath}/nest/example-app/docker-compose.override.example.yml`,
            `${appDir}/docker-compose.override.example.yml`
          ),
          copyAsync(
            `${assetsPath}/nest/example-app/migrations`,
            `${appDir}/migrations`
          ),
          copyAsync(
            `${assetsPath}/${framework}/example-app/tsconfig.build.json`,
            `${appDir}/tsconfig.build.json`,
            { overwrite: true }
          ),
          copyAsync(
            `${assetsPath}/nest/example-app/tsconfig.json`,
            `${appDir}/tsconfig.json`,
            { overwrite: true }
          ),
        ]);

        Object.assign(envVars, {
          Knex: {
            DEBUG: 'knex:query',
          },
        });

        Object.assign(pkgJson.dependencies, {
          knex: '^2.4.2',
          'pg-error-enum': '^0.6.0',
        });

        Object.assign(pkgJson.scripts, {
          'db:connection:print': 'ts-node scripts/db-connection',
          'db:migrate:make':
            'knex migrate:make -x ts --migrations-directory ./migrations',
          'db:migrate:up':
            'ts-node node_modules/knex/bin/cli.js migrate:up --migrations-directory ./migrations --client pg --migrations-table-name knex_migrations --connection $(ts-node scripts/db-connection)',
          'db:migrate:down':
            'ts-node node_modules/knex/bin/cli.js migrate:down --migrations-directory ./migrations --client pg --migrations-table-name knex_migrations --connection $(ts-node scripts/db-connection)',
          'db:migrate:latest':
            'ts-node node_modules/knex/bin/cli.js migrate:latest --migrations-directory ./migrations --client pg --migrations-table-name knex_migrations --connection $(ts-node scripts/db-connection)',
          'db:migrate:rollback':
            'ts-node node_modules/knex/bin/cli.js migrate:rollback --migrations-directory ./migrations --client pg --migrations-table-name knex_migrations --connection $(ts-node scripts/db-connection)',
          'db:migrate:version':
            'ts-node node_modules/knex/bin/cli.js migrate:currentVersion --migrations-directory ./migrations --client pg --migrations-table-name knex_migrations --connection $(ts-node scripts/db-connection)',
          'db:migrate:status':
            'ts-node node_modules/knex/bin/cli.js migrate:status --migrations-directory ./migrations --client pg --migrations-table-name knex_migrations --connection $(ts-node scripts/db-connection)',
          'db:migrate:reset':
            'npm run db:migrate:rollback --all && npm run db:migrate:latest',
        });

        await copyAsync(`${assetsPath}/db/pg/scripts`, `${appDir}/scripts`, {
          overwrite: true,
        });
      }
    } catch (err) {
      throw new Error(`An error has occurred while installing Nest: ${err}`);
    }

    success(
      'Nest installation completed successfully. Please wait for the other steps to be completed...'
    );
  };
};
