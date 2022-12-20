'use strict';

module.exports = (toolbox) => {
  toolbox.setupTs = ({
    appDir,
    moduleType,
    pkgJsonScripts,
    pkgJsonInstalls,
    assetsPath,
    framework,
  }) => {
    const {
      filesystem: { copyAsync, copy, write, read },
      print: { success, muted },
    } = toolbox;

    async function asyncOperations() {
      if (framework !== 'nest') {
        muted('Configuring TS...');
        try {
          await copyAsync(
            `${assetsPath}/tsconfig.build.json`,
            `${appDir}/tsconfig.build.json`
          );
        } catch (err) {
          throw new Error(
            `An error has occurred while executing TS configuration: ${err}`
          );
        }

        success(
          'TS configured successfully. Please wait for the other steps to be completed...'
        );
      }
    }

    function syncOperations() {
      if (framework !== 'nest') {
        copy(`${assetsPath}/tsconfig.json`, `${appDir}/tsconfig.json`);
        pkgJsonScripts.push({
          ['build']: 'tsc --build && tsc-alias',
          ['prepare']: 'npm run build',
        });
        pkgJsonInstalls.push('typescript @tsconfig/recommended tsc-alias');
      }
      const tsConfig = JSON.parse(read(`${appDir}/tsconfig.json`));

      if (moduleType === 'ESM') {
        tsConfig.compilerOptions = {
          ...tsConfig.compilerOptions,
          module: 'ES2015',
        };
      }
      write(`${appDir}/tsconfig.json`, tsConfig);
    }

    return {
      asyncOperations,
      syncOperations,
    };
  };
};
