
const reactPreset = require.resolve('babel-preset-react');
const es2015Modules = require.resolve('babel-plugin-transform-es2015-modules-commonjs');

require('babel-register')({
  presets: [reactPreset],
  plugins: [es2015Modules],
});
