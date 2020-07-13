module.exports = [
  {
    name: 'useService',
    type: 'confirm',
    message: 'Use service (使用服务) ?',
    default: true
  },
  {
    name: 'useMock',
    type: 'confirm',
    message: 'Use mock (使用 mock) ?',
    default: true,
    when: options => options.useService
  },
  {
    name: 'useVexip',
    type: 'confirm',
    message: 'Use vexip-ui (使用 vexip-ui) ?',
    default: true
  },
  {
    name: 'useStylelint',
    type: 'confirm',
    message: 'Use stylelint (使用 stylelint) ?',
    default: true
  }
]
