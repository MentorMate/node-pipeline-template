import { GluegunToolbox } from 'gluegun';
import { UserInput } from '../@types';

export default (toolbox: GluegunToolbox) => {
  toolbox.setupPostgreSQL = ({
    assetsPath,
    appDir,
    envVars,
    pkgJson,
    isExampleApp,
  }: UserInput) => {
    const {
      filesystem: { copyAsync },
    } = toolbox;

    const syncOperations = () => {
      Object.assign(envVars, {
        PostgreSQL: {
          PGHOST: 'localhost',
          PGPORT: 5432,
          PGUSER: 'user',
          PGPASSWORD: 'password',
          PGDATABASE: 'default',
        },
      });

      Object.assign(pkgJson.dependencies, {
        pg: '^8.9.0',
      });

      Object.assign(pkgJson.devDependencies, {
        '@types/pg': '^8.6.6',
      });
    };

    const asyncOperations = async () => {
      // TODO: move out somehow
      if (isExampleApp) {
        return;
      }

      await Promise.all([
        copyAsync(
          `${assetsPath}/db/pg/docker-compose.yml`,
          `${appDir}/docker-compose.yml`,
        ),
        copyAsync(
          `${assetsPath}/db/pg/docker-compose.override.example.yml`,
          `${appDir}/docker-compose.override.example.yml`,
        ),
      ]);
    };

    return {
      syncOperations,
      asyncOperations,
    };
  };
};
