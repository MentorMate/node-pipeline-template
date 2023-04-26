const extend = require('./install-framework');
const {
  createToolboxMock,
  createExtensionInput,
} = require('../utils/test/mocks');

describe('install-framework', () => {
  let toolbox;

  beforeEach(() => {
    toolbox = createToolboxMock();
    extend(toolbox);
  });

  it('should be defined', () => {
    expect(extend).toBeDefined();
  });

  it('should set installFramework on toolbox', () => {
    expect(toolbox.installFramework).toBeDefined();
  });

  describe('installFramework', () => {
    const input = createExtensionInput();
    let envVars;
    let scripts;
    let dependencies;
    let devDependencies;

    beforeAll(() => {
      input.projectLanguage = 'JS';
    });

    beforeEach(() => {
      toolbox.print.muted = jest.fn(() => {});
      toolbox.print.success = jest.fn(() => {});
      toolbox.print.error = jest.fn(() => {});
      toolbox.filesystem.dir = jest.fn(() => {});
      toolbox.filesystem.copyAsync = jest.fn(() => {});
      toolbox.template.generate = jest.fn(() => {});
      toolbox.system.run = jest.fn(() => {});
      toolbox.installFramework(input);
      envVars = input.envVars;
      scripts = input.pkgJson.scripts;
      dependencies = input.pkgJson.dependencies;
      devDependencies = input.pkgJson.devDependencies;
    });

    it('should print a muted and a success message', async () => {
      expect(toolbox.print.muted).toHaveBeenCalledTimes(1);
      expect(toolbox.print.success).toHaveBeenCalledTimes(1);
      expect(toolbox.print.error).not.toHaveBeenCalled();
    });

    it('should add the HTTP env var section', () => {
      expect(envVars).toHaveProperty('HTTP');
      expect(envVars['HTTP']).toHaveProperty('PORT');
    });

    it('should add http-terminator to dependencies', () => {
      expect(dependencies).toHaveProperty('http-terminator');
    });

    it('should install add nodemon to devDependencies', () => {
      expect(devDependencies).toHaveProperty('nodemon');
    });

    it('should add the start script', () => {
      expect(scripts).toHaveProperty('start');
    });

    it('should add the start:dev script', () => {
      expect(scripts).toHaveProperty('start:dev');
    });

    it('should generate a nodemon.json file', () => {
      expect(toolbox.template.generate).toHaveBeenCalledWith({
        template: 'nodemon/nodemon.json.ejs',
        target: `${input.appDir}/nodemon.json`,
        props: {
          ext: input.projectLanguage === 'TS' ? 'ts' : 'js',
          exec: input.pkgJson.scripts['start'],
        },
      });
    });

    describe('when the framework is express', () => {
      beforeAll(() => {
        input.projectLanguage = 'JS'; // else-branch coverage
        input.framework = 'express';
      });

      it('should install add the framework to dependencies', () => {
        expect(dependencies).toHaveProperty('express');
      });

      it('should add helmet to dependencies', () => {
        expect(dependencies).toHaveProperty('helmet');
      });

      it('should add compression to dependencies', () => {
        expect(dependencies).toHaveProperty('compression');
      });

      it('should add cors to dependencies', () => {
        expect(dependencies).toHaveProperty('cors');
      });

      describe('and the language is TypeScript', () => {
        beforeAll(() => {
          input.projectLanguage = 'TS';
        });

        it('should add @types/express to devDependencies', () => {
          expect(devDependencies).toHaveProperty('@types/express');
        });

        it('should add @types/compression to devDependencies', () => {
          expect(devDependencies).toHaveProperty('@types/compression');
        });

        it('should add @types/cors to devDependencies', () => {
          expect(devDependencies).toHaveProperty('@types/cors');
        });
      });
    });

    describe('when it is not the example app', () => {
      beforeAll(() => {
        input.isExampleApp = false;
      });

      describe('and the language is JavaScript', () => {
        beforeAll(() => {
          input.projectLanguage = 'JS';
        });

        it('should copy the project source', () => {
          expect(toolbox.filesystem.copyAsync).toHaveBeenCalledWith(
            `${input.assetsPath}/express/js/src/`,
            `${input.appDir}/src/`
          );
        });
      });

      describe('and the language is TypeScript', () => {
        beforeAll(() => {
          input.projectLanguage = 'TS';
        });

        it('should copy the project source', () => {
          expect(toolbox.filesystem.copyAsync).toHaveBeenCalledWith(
            `${input.assetsPath}/express/ts/src/`,
            `${input.appDir}/src/`
          );
        });
      });
    });

    describe('when it is the example app', () => {
      beforeAll(() => {
        input.isExampleApp = true;
      });

      afterAll(() => {
        input.isExampleApp = false;
      });

      it('should copy the example project source', () => {
        expect(toolbox.filesystem.copyAsync).toHaveBeenCalledWith(
          `${input.assetsPath}/express/example-app/src/`,
          `${input.appDir}/src/`
        );
      });

      it('should add cors to dependencies', () => {
        expect(dependencies).toHaveProperty('cors');
      });

      it('should add pino to dependencies', () => {
        expect(dependencies).toHaveProperty('pino');
      });

      it('should add http-errors to dependencies', () => {
        expect(dependencies).toHaveProperty('http-errors');
      });

      it('should add bcrypt to dependencies', () => {
        expect(dependencies).toHaveProperty('bcrypt');
      });

      it('should add query-types to dependencies', () => {
        expect(dependencies).toHaveProperty('query-types');
      });

      it('should add statuses to dependencies', () => {
        expect(dependencies).toHaveProperty('statuses');
      });

      it('should add zod to dependencies', () => {
        expect(dependencies).toHaveProperty('zod');
      });

      it('should add @asteasolutions/zod-to-openapi to dependencies', () => {
        expect(dependencies).toHaveProperty('@asteasolutions/zod-to-openapi');
      });

      it('should add @types/cors to devDependencies', () => {
        expect(devDependencies).toHaveProperty('@types/cors');
      });

      it('should add pino-pretty to devDependencies', () => {
        expect(devDependencies).toHaveProperty('pino-pretty');
      });

      it('should add @types/http-errors to devDependencies', () => {
        expect(devDependencies).toHaveProperty('@types/http-errors');
      });

      it('should add @types/bcrypt to devDependencies', () => {
        expect(devDependencies).toHaveProperty('@types/bcrypt');
      });

      it('should add @types/statuses to devDependencies', () => {
        expect(devDependencies).toHaveProperty('@types/statuses');
      });

      it('should add @types/uuid to devDependencies', () => {
        expect(devDependencies).toHaveProperty('@types/uuid');
      });

      it('should add uuid to devDependencies', () => {
        expect(devDependencies).toHaveProperty('uuid');
      });

      it('should add the OpenAPI env var section', () => {
        expect(envVars).toHaveProperty('OpenAPI');
        expect(envVars['OpenAPI']).toHaveProperty('SWAGGER_UI_PORT');
      });

      it('should add the openapi scripts', () => {
        expect(Object.keys(scripts)).toEqual(
          expect.arrayContaining([
            'openapi:g',
            'openapi:ui:run',
            'openapi:ui:open',
            'openapi:serve',
          ])
        );
      });

      it('should add concurrently to devDependencies', () => {
        expect(devDependencies).toHaveProperty('concurrently');
      });

      it('should add open to devDependencies', () => {
        expect(devDependencies).toHaveProperty('open');
      });

      it('should copy the openapi-generate script', () => {
        expect(toolbox.filesystem.copyAsync).toHaveBeenCalledWith(
          `${input.assetsPath}/express/example-app/scripts/generate-openapi.ts`,
          `${input.appDir}/scripts/generate-openapi.ts`
        );
      });

      it('should copy the openapi container await script', () => {
        expect(toolbox.filesystem.copyAsync).toHaveBeenCalledWith(
          `${input.assetsPath}/express/example-app/scripts/await-openapi-ui-start.sh`,
          `${input.appDir}/scripts/await-openapi-ui-start.sh`
        );
      });

      it('should copy the .openapi dir', () => {
        expect(toolbox.filesystem.copyAsync).toHaveBeenCalledWith(
          `${input.assetsPath}/express/example-app/.openapi`,
          `${input.appDir}/.openapi`
        );
      });

      it('should add Knex env vars', () => {
        expect(envVars).toHaveProperty('Knex');
        expect(envVars['Knex']).toHaveProperty('DEBUG');
      });

      it('should add knex to dependencies', () => {
        expect(dependencies).toHaveProperty('knex');
      });

      it('should add pg-error-enum to dependencies', () => {
        expect(dependencies).toHaveProperty('pg-error-enum');
      });

      it('shoudl add knex migration scripts', () => {
        expect(Object.keys(scripts)).toEqual(
          expect.arrayContaining([
            'db:connection:print',
            'db:migrate:make',
            'db:migrate:up',
            'db:migrate:down',
            'db:migrate:latest',
            'db:migrate:rollback',
            'db:migrate:version',
            'db:migrate:status',
            'db:migrate:reset',
          ])
        );
      });

      it('should copy the pg scripts', () => {
        expect(toolbox.filesystem.copyAsync).toHaveBeenCalledWith(
          `${input.assetsPath}/db/pg/scripts`,
          `${input.appDir}/scripts`,
          { overwrite: true }
        );
      });
    });
  });
});
