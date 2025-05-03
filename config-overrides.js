// config-overrides.js
const webpack = require('webpack');
const fs = require('fs');
const dotenv = require('dotenv');

module.exports = function override(config, env) {
  // Load environment variables from .env file
  const dotenvFile = '.env';
  let envVars = {};
  
  if (fs.existsSync(dotenvFile)) {
    const envConfig = dotenv.parse(fs.readFileSync(dotenvFile));
    
    // Create process.env variables for all the .env variables
    for (const key in envConfig) {
      envVars[`process.env.${key}`] = JSON.stringify(envConfig[key]);
    }
  }
  
  // Add the webpack DefinePlugin to inject these variables
  config.plugins = [
    ...config.plugins,
    new webpack.DefinePlugin(envVars)
  ];
  
  return config;
};
