module.exports = (api, options, rootOptions) => {
  const { EOL } = require('os')
  const fs = require('fs')
  const useRouter = rootOptions.router || api.hasPlugin('router')
  const useTypeScript = api.hasPlugin('typescript')
  const useService = options.useService
  const useMock = options.useMock
  const useVexip = options.useVexip
  const useSass = rootOptions.cssPreprocessor && rootOptions.cssPreprocessor.includes('sass')

  const renderOptions = {
    useRouter,
    useTypeScript,
    useService,
    useMock,
    useVexip,
    useSass
  }

  api.exitLog('Use Router: ' + useRouter)
  api.exitLog('Use TypeScript: ' + useTypeScript)
  api.exitLog('Use Service: ' + useService)
  api.exitLog('Use Mock: ' + useMock)
  api.exitLog('Use Vexip: ' + useVexip)
  api.exitLog('Use Sass: ' + useSass)

  api.postProcessFiles(files => {
    for (const file in files) {
      if (/(Home|About|HelloWorld)\.vue/i.test(file)) {
        delete files[file]
      }

      if (useVexip && /normalize.s?css/i.test(file)) {
        delete files[file]
      }
    }
  })

  api.render('./template/common', renderOptions)

  if (useRouter) {
    api.render('./template/router', renderOptions)

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
    api.render('./template/service', renderOptions)
    api.injectImports(api.entryFile, `import './service'`)
  }

  if (useMock) {
    api.extendPackage({
      devDependencies: {
        mockjs: '^1.1.0'
      }
    })

    api.render('./template/mock', renderOptions)

    if (useTypeScript) {
      api.extendPackage({
        devDependencies: {
          '@types/mockjs': '^1.0.2'
        }
      })
    }
  }

  if (useSass) {
    api.render('./template/style/scss', renderOptions)
  } else {
    api.render('./template/style/css', renderOptions)
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
    dependencies: {
      axios: '^0.19.2'
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

  if (useVexip) {
    api.extendPackage({
      dependencies: {
        'vexip-ui': '^0.8.16'
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

  if (useMock) {
    api.onCreateComplete(() => {
      const contentMain = fs.readFileSync(api.resolve(api.entryFile), { encoding: 'utf-8' })

      if (!contentMain.includes(`require('./mock')`)) {
        const reverseLines = contentMain.split(/\r?\n/g).reverse()

        const importIndex = reverseLines.findIndex(line => line.match(/^import/))
    
        reverseLines[importIndex] += `${EOL}${EOL}if (process.env.NODE_ENV === 'development') {${EOL}  require('./mock')${EOL}}${EOL}`
        fs.writeFileSync(api.entryFile, reverseLines.reverse().join(EOL), { encoding: 'utf-8' })
      }
    })
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

    api.render('./template/shims', renderOptions)

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
