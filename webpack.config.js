const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const swcDefaultConfig = require('@nestjs/cli/lib/compiler/defaults/swc-defaults').swcDefaultsFactory().swcOptions;
const TerserPlugin = require('terser-webpack-plugin');
require('dotenv').config();

// Determine production environment
const isProduction = process.env.NODE_ENV === 'production';
module.exports = {
  // Entry point for the application
  entry: './src/app.ts',

  // Output configuration
  output: {
    filename: 'app.js', // Output filename
    path: path.resolve(__dirname, 'dist'), // Output directory
  },

  // Resolve extensions and configure path aliases
  resolve: {
    extensions: ['.ts', '.js'], // Handle both .ts and .js files
    plugins: [new TsconfigPathsPlugin()], // Resolve path aliases based on tsconfig
  },

  // Module configuration for processing files
  module: {
    rules: [
      {
        test: /\.(js|ts)$/, // Apply to .js and .ts files
        use: {
          loader: 'swc-loader', // Use SWC for fast transpilation
          options: swcDefaultConfig, // Apply SWC default settings from NestJS
        },
        exclude: [/node_modules/, /test/, /dist/, /\.spec\.ts$/, /scripts/], // Exclude unnecessary directories
      },
    ],
  },

  // Set the mode based on environment
  mode: isProduction ? 'production' : 'development',

  // Source map configuration for development mode
  devtool: isProduction ? false : 'source-map', // Use source maps only in development

  // Optimization settings for minimizing the bundle
  optimization: {
    minimize: isProduction, // Enable minimization only in production mode
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: false, // Disable name mangling to preserve original names
          keep_classnames: true, // Keep class names for debugging
          keep_fnames: true, // Keep function names for debugging
        },
        extractComments: false, // Do not extract comments into separate files
      }),
    ],
  },

  // Caching settings to improve build performance
  cache: {
    type: 'filesystem', // Use filesystem-based cache for faster incremental builds
  },
};
