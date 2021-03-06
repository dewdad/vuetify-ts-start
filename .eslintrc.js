module.exports = {
  root: true,
  env: {
    node: true
  },
  "globals": {
    "_": true,
    "errors":true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "space-infix-ops": "off",
    'no-return-await':'off',
    "no-useless-call":"off",
    "no-use-before-define":"off"
  }
}
