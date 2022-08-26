import { Config } from 'remotion';

import { webpackOverride } from './app/webpack-override';

Config.Bundling.overrideWebpackConfig(webpackOverride);