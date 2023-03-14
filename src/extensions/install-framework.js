'use strict';

module.exports = (toolbox) => {
  toolbox.installFramework = async ({
    projectLanguage,
    framework,
    appDir,
    assetsPath,
    pkgJson,
    envVars,
  }) => {
    const {
      filesystem: { copyAsync },
      print: { success, muted },
      template: { generate },
    } = toolbox;

    const frameworkVersion = {
      express: '^4.18.2',
      fastify: '^4.13.0',
    };

    muted(`Installing ${framework}...`);

    Object.assign(envVars, {
      HTTP: {
        PORT: 3000,
      },
    });

    Object.assign(pkgJson.dependencies, {
      [framework]: frameworkVersion[framework],
    });

    Object.assign(pkgJson.devDependencies, {
      dotenv: '^16.0.3',
      nodemon: '^2.0.20',
    });

    const executable = projectLanguage === 'TS' ? 'npx ts-node' : 'node';
    const pathAliasRegistration =
      projectLanguage === 'TS' ? '-r tsconfig-paths/register' : '';

    Object.assign(pkgJson.scripts, {
      start: `${executable} -r dotenv/config ${pathAliasRegistration} src/index`,
      'start:dev': 'nodemon',
    });

    if (projectLanguage === 'TS') {
      Object.assign(pkgJson.scripts, {
        start: `${executable} -r dotenv/config -r tsconfig-paths/register src/index`,
      });
    }

    await generate({
      template: 'nodemon/nodemon.json.ejs',
      target: `${appDir}/nodemon.json`,
      props: {
        ext: projectLanguage === 'TS' ? 'ts' : 'js',
        exec: pkgJson.scripts['start'],
      },
    });

    // TypeScript
    if (projectLanguage === 'TS') {
      await Promise.all([
        copyAsync(`${assetsPath}/src/`, `${appDir}/src/`),
        copyAsync(`${assetsPath}/test/`, `${appDir}/test/`),
      ]);
    }

    // Express
    if (framework === 'express') {
      Object.assign(pkgJson.dependencies, {
        helmet: '^6.0.1',
        cors: '^2.8.5',
        compression: '^1.7.4',
        'http-terminator': '^3.2.0',
        pino: '^8.11.0',
        'http-errors': '^2.0.0',
        bcrypt: '^5.1.0',
      });

      // with TypeScript
      if (projectLanguage === 'TS') {
        copyAsync(`${assetsPath}/${framework}/src/`, `${appDir}/src/`, {
          overwrite: true,
        });

        Object.assign(pkgJson.dependencies, {
          zod: '^3.20.6',
        });

        Object.assign(pkgJson.devDependencies, {
          '@types/express': '^4.17.17',
          '@types/cors': '^2.8.5',
          '@types/compression': '^1.7.2',
          'pino-pretty': '^9.4.0',
          '@types/http-errors': '^2.0.1',
        });
      }
    }

    success(
      `${framework} installation completed successfully. Please wait for the other steps to be completed...`
    );
  };
};
