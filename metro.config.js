const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    sourceExts: [...defaultConfig.resolver.sourceExts, 'jsx', 'js', 'ts', 'tsx'],
    extraNodeModules: {
      'react-native': require.resolve('react-native'),
    },
  },
  transformer: {
    ...defaultConfig.transformer,
    babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
  },
}; 