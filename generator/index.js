module.exports = (api, options, rootOptions) => {
  const { EOL } = require('os')
  const fs = require('fs')
  const useTypeScript = api.hasPlugin('typescript')
  const useSass = rootOptions.cssPreprocessor && rootOptions.cssPreprocessor.includes('sass')
  const useRouter = rootOptions.router || api.hasPlugin('router')
  const useVexip = options.useVexip
  const useService = options.useService
  const useAxios = options.useAxios

  api.exitLog('Use Router: ' + useRouter)
  api.exitLog('Use TypeScript: ' + useTypeScript)
  api.exitLog('Use Sass: ' + useSass)
  api.exitLog('Use Vexip: ' + useVexip)
  api.exitLog('Use Service: ' + useService)
  api.exitLog('Use Axios: ' + useAxios)

  api.postProcessFiles(files => {
    for (const file in files) {
      if (/(Home|About|HelloWorld)\.vue/i.test(file)) {
        delete files[file]
      }
    }
  })

  api.render('./template/common', {
    useSass,
    useTypeScript,
    useRouter,
    useVexip
  })

  if (useRouter) {
    api.render('./template/router', {
      useTypeScript
    })

    if (useTypeScript) {
      api.onCreateComplete(() => {
        fs.writeFileSync(
          api.resolve('./src/router/index.ts'),
          `import router from './router'${EOL}${EOL}export default router${EOL}`,
          { encoding: 'utf-8' }
        )
      })
    }
  }

  if (useService) {
    api.render('./template/service', {
      useAxios
    })
  }

  if (useSass) {
    api.render('./template/style/scss', {
      useVexip
    })
  } else {
    api.render('./template/style/scss')
  }

  api.extendPackage({
    config: {
      commitizen: {
        path: 'node_modules/cz-customizable'
      },
      'cz-customizable': {
        config: 'scripts/cz-config.js'
      }
    },
    devDependencies: {
      chalk: '^4.1.0',
      commitizen: '^4.1.2',
      'cz-customizable': '^6.2.0',
      'lint-staged': '^10.2.11'
    },
    gitHooks: {
      'pre-commit': 'lint-staged',
      'commit-msg': 'node scripts/verify-commit.js'
    },
    scripts: {
      'lint:style': 'stylelint **/*.{vue,scss} --fix',
      'serve:prod': 'vue-cli-service serve --mode production'
    }
  })

  if (options.useAxios) {
    api.extendPackage({
      dependencies: {
        axios: '^0.19.2'
      }
    })
  }

  if (useVexip) {
    api.extendPackage({
      dependencies: {
        'vexip-ui': '^0.8.13'
      }
    })

    api.onCreateComplete(() => {
      const contentMain = fs.readFileSync(api.resolve(api.entryFile), { encoding: 'utf-8' })
      const contentMainLines = contentMain.split(/\r?\n/g)

      if (!contentMain.includes(`import VexipUI from 'vexip-ui'`)) {
        const targetIndex = contentMainLines.findIndex(line => line.match(/import Vue from 'vue'/))

        contentMainLines[targetIndex] += `${EOL}import VexipUI from 'vexip-ui'`
      }

      if (!contentMain.includes('Vue.use(VexipUI)')) {
        const targetIndex = contentMainLines.findIndex(line => line.match(/Vue\.config\.productionTip/))

        contentMainLines[targetIndex] += `${EOL}${EOL}Vue.use(VexipUI)`
      }

      if (!useSass && !contentMain.includes(`import 'vexip-ui/dist/vexip-ui.css'`)) {
        contentMainLines.reverse()

        const importIndex = contentMainLines.findIndex(line => line.match(/^import/))
  
        contentMainLines[importIndex] += `${EOL}${EOL}import 'vexip-ui/dist/vexip-ui.css'`
        contentMainLines.reverse()
      }

      if (!contentMain.match(/import '\.\/style\/index\.s?css'/)) {
        contentMainLines.reverse()

        const importIndex = contentMainLines.findIndex(line => line.match(/^import/))

        contentMainLines[importIndex] += `${EOL}${useSass ? EOL : ''}import './style/index.${useSass ? 'scss' : 'css'}'`
        contentMainLines.reverse()
      }

      fs.writeFileSync(api.entryFile, contentMainLines.join(EOL), { encoding: 'utf-8' })
    })

    if (useTypeScript) {
      api.onCreateComplete(() => {
        fs.writeFileSync(api.resolve('./src/vexip-ui.d.ts'), `declare module 'vexip-ui'${EOL}`, { encoding: 'utf-8' })
      })
    }
  }

  if (options.useStylelint) {
    api.extendPackage({
      devDependencies: {
        stylelint: '^13.6.1',
        'stylelint-config-recess-order': '^2.0.4',
        'stylelint-config-standard': '^20.0.0',
        'stylelint-order': '^4.1.0',
        'stylelint-prettier': '^1.1.2',
        'stylelint-webpack-plugin': '^2.1.0'
      }
    })

    if (useSass) {
      api.extendPackage({
        devDependencies: {
          'stylelint-scss': '^3.18.0'
        }
      })
    }
  }

  if (useTypeScript) {
    const jsRE = /\.js$/
    const excludeRE = /^scripts?\/|tests\/e2e\/|(\.config|rc)\.js$/

    api.postProcessFiles(files => {
      for (const file in files) {
        if (jsRE.test(file) && !excludeRE.test(file)) {
          const tsFile = file.replace(jsRE, '.ts')

          if (!files[tsFile]) {
            files[tsFile] = files[file]
          }

          delete files[file]
        }
      }
    })
  }
}
