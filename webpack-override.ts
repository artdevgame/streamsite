import type { WebpackOverrideFn } from "remotion";

export const webpackOverride: WebpackOverrideFn = (currentConfiguration) => {
  const config = {
    ...currentConfiguration,
    module: {
      ...currentConfiguration.module,
      rules: [
        ...(currentConfiguration.module?.rules
          ? currentConfiguration.module.rules
          : []
        ).filter((rule) => {
          if (rule === "...") {
            return false;
          }
          if (rule.test?.toString().includes(".css")) {
            return false;
          }
          return true;
        }),
        {
          test: /\.css$/i,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [
                    "postcss-preset-env",
                    "tailwindcss",
                    "autoprefixer",
                  ],
                },
              },
            },
          ],
        },
      ],
    },
  };

  console.log(JSON.stringify(config.module.rules));

  return config;
};
