const isTest = process.env.NODE_ENV === 'test';

module.exports = {
  presets: [
    ['@babel/preset-env',
      { targets: {
        node: isTest ? 'current' : 6 }}]],
  plugins: [
    ['@babel/plugin-transform-runtime',
      { absoluteRuntime: false,
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: false }]],
};
