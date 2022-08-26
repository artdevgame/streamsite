import { Config } from 'remotion';

import { webpackOverride } from './app/remotion/webpack-override';

Config.Bundling.overrideWebpackConfig(webpackOverride);