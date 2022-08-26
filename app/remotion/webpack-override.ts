import type { WebpackOverrideFn } from 'remotion';

export const webpackOverride: WebpackOverrideFn = (config) => {
  const rules = config.module?.rules ?? []
  const keepRules = rules.filter(rule => !(rule === '...' || rule.test?.toString().includes('.css')))
  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: ['postcss-preset-env', 'tailwindcss', 'autoprefixer']
      }
    }
  }
  const cssRule = {
    test: /.css$/i,
    use: ['style-loader', 'css-loader', postcssLoader]
  }

  config.module = {
    ...config.module,
    rules: [
      ...keepRules,
      cssRule
    ]
  }

  console.log(JSON.stringify(config, undefined, 2))

  return config;
};
