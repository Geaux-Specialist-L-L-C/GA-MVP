// File: /babel.config.cjs
// Description: Babel configuration for Jest testing environment
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
  plugins: [
    'babel-plugin-styled-components'
  ]
};