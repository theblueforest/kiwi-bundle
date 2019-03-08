import Webpack from "webpack"
import pathLib from "path"
import { WebpackMode } from "./core"
import configRules from "./config.rules"
import configPlugins from "./config.plugins"

interface WebpackConfig extends Webpack.Configuration {
  entry: any
  output: any
  devServer?: any
  optimization: any
}

const generateJsOutputPath = (mode: WebpackMode, data?: any) => {
  const isSw = typeof data !== "undefined" && data.chunk.name === "sw"
  const isProd = mode === WebpackMode.PRODUCTION
  return `${isSw ? "" : "static/"}[name].${isProd ? "[contenthash].min" : "[hash]"}.js`
}

export default (path: string, outputPath: string, kiwiConfig: any, mode: WebpackMode): WebpackConfig => {
  const bundlePath = pathLib.join(path, "node_modules", "kiwi-bundle")

  // Common config
  const config: WebpackConfig = {
    mode,

    resolve: {
      extensions: [ ".ts", ".tsx", ".js" ],
      modules: [
        pathLib.join(bundlePath, "node_modules")
      ],
      alias: {
        "kiwi-bundle": bundlePath,
      },
    },

    entry: {
      main: [ pathLib.join(path, "src", "client", "index.ts") ],
      sw: pathLib.join(bundlePath, "src", "sw", "index.ts"),
    },

    output: {
      filename: (data: any) => generateJsOutputPath(mode, data),
      chunkFilename: generateJsOutputPath(mode),
      publicPath: "/",
      path: outputPath,
    },

    module: {
      rules: configRules.generate(mode),
    },

    plugins: configPlugins(path, bundlePath, kiwiConfig).generate(mode),

    devtool: mode === WebpackMode.PRODUCTION ? "source-map" : "eval",

    performance: {
      hints: false,
    },

    optimization: {
      splitChunks: {
        cacheGroups: {
          vendors: {
            name: "vendors",
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
          },
        },
      },
    },
  }

  // Mode options
  if(mode === WebpackMode.DEVELOPMENT) {

    // DEV SERVER & HOT RELOADER ENTRIES
    config.entry.main.unshift("webpack/hot/only-dev-server")
    config.entry.main.unshift(
      "webpack-dev-server/client"
        + `?http://${kiwiConfig.platforms.web.devHost}:${kiwiConfig.platforms.web.devPort}`
    )

    // DEV SERVER CONFIG
    config.devServer = {
      host: kiwiConfig.platforms.web.devHost,
      port: kiwiConfig.platforms.web.devPort,
      historyApiFallback: true,
      clientLogLevel: "warning",
      inline: true,
      progress: true,
      hot: true,
    }

    // GLOBAL VARS
    config.output.globalObject = "(typeof self !== 'undefined' ? self : this)"

  }

  return config
}