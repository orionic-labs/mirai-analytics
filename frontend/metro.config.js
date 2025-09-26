// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// ✅ Don’t override watchFolders or blockList — keep Expo defaults
// If you previously added them, remove those lines entirely.

// ✅ Pin key packages to this app's node_modules to avoid duplicate contexts
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...(config.resolver?.extraNodeModules || {}),
    react: path.resolve(__dirname, 'node_modules/react'),
    'react-native': path.resolve(__dirname, 'node_modules/react-native'),
    '@react-navigation/native': path.resolve(__dirname, 'node_modules/@react-navigation/native'),
    '@react-navigation/bottom-tabs': path.resolve(
      __dirname,
      'node_modules/@react-navigation/bottom-tabs'
    ),
    '@react-navigation/native-stack': path.resolve(
      __dirname,
      'node_modules/@react-navigation/native-stack'
    ),
    '@react-navigation/elements': path.resolve(
      __dirname,
      'node_modules/@react-navigation/elements'
    ),
  },
  // (Optional, but helps) force Metro to only look here for deps
  nodeModulesPaths: [path.resolve(__dirname, 'node_modules')],
};

module.exports = withNativeWind(config, { input: './global.css' });
