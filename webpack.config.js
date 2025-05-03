// webpack.config.js
const { DefinePlugin } = require('webpack');
const dotenv = require('dotenv');

// Load environment variables from .env file
const env = dotenv.config().parsed || {};

// Create a set of environment variables to pass to the application
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = (webpackConfig) => {
  // Add the DefinePlugin to inject environment variables
  webpackConfig.plugins.push(new DefinePlugin(envKeys));
  
  return webpackConfig;
};
