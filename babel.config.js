module.exports = {
    presets: [
      ['@babel/preset-env', {
        targets: '> 0.25%, not dead', // Customize the target environment as needed
      }],
      '@babel/preset-react', // Include this if you're using React
    ],
    plugins: [
        '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-optional-chaining',
      ],
  };