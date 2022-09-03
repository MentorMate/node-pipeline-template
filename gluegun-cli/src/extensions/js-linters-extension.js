'use strict'

module.exports = (toolbox) => {
  toolbox.jsLinters = ({
    appDir,
    projectLanguage,
    moduleType,
    pkgJsonScripts,
    pkgJsonInstalls,
    assetsPath,
  }) => {
    const {
      template: { generate },
      filesystem: { copyAsync },
      print: { error, success, muted },
    } = toolbox

    async function asyncOperations() {
      muted('Configuring JS linters...')
      try {
        await Promise.all([
          generate({
            template: 'eslintrc-model.js.ejs',
            target: `${appDir}/.eslintrc.js`,
            props: {
              ts: projectLanguage === 'TS',
              cjs: moduleType === 'CJS',
            },
          }),
          generate({
            template: 'prettierrc-model.js.ejs',
            target: `${appDir}/.prettierrc.js`,
          }),
          copyAsync(`${assetsPath}/.eslintignore`, `${appDir}/.eslintignore`),
          copyAsync(
            `${assetsPath}/.prettierignore`,
            `${appDir}/.prettierignore`
          ),
        ])
      } catch (err) {
        error(
          `An error has occurred while executing JS linters configuration: ${err}`
        )
      }

      success('JS linters configured successfully')
    }

    function syncOperations() {
      const lintScript =
        projectLanguage === 'TS'
          ? 'eslint . --ext .js .ts'
          : 'eslint . --ext .js'

      pkgJsonScripts.push({
        ['prettier:format']: 'prettier --write',
        ['prettier:check-format']: 'prettier --list-different',
        ['lint']: lintScript,
        ['lint:fix']: 'npm run lint --fix',
      })
      pkgJsonInstalls.push(
        'prettier eslint eslint-config-prettier eslint-config-google'
      )
      if (projectLanguage === 'TS') {
        pkgJsonInstalls.push(
          '@typescript-eslint/eslint-plugin @typescript-eslint/parser'
        )
      }
    }

    return {
      asyncOperations,
      syncOperations,
    }
  }
}