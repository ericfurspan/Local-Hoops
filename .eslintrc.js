module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
  },
  env: {
    browser: true,
    jest: true,
    'react-native/react-native': true,
  },
  plugins: ['react', 'react-native'],
  extends: [
    'airbnb',
    '@react-native-community',
    'prettier',
    'prettier/react',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'warn',
    'react/prop-types': 0,
    'react/no-array-index-key': 'warn',
    'import/prefer-default-export': 0,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
