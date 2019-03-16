const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const JsDocPlugin = require('jsdoc-webpack4-plugin');

const env = process.env.NODE_ENV;

let webpackConfig = {
    devtool: env == "production" ? "" : "cheap-module-eval-source-map",
    mode: env,
    entry: {
        "main": "main",
    },
    target: "web",
  	output: {
  	  filename: "[name].js",
  	  path: path.resolve(__dirname, "dist"),
      library: "Telechart",
  	  libraryTarget: "umd",
  	},
  	module : {
  		rules : [
  			  {
	            test: /\.(js$)/,
              // exclude: /(node_modules)/,
	            use: [{
	                loader: "babel-loader",
                  options: {
                      presets: ["@babel/env"]
                  }
	            }]
	        },
  		]
  	},
  	resolve : {
  		modules: ["src", "node_modules", "data", "res"],
  	},
  	resolveLoader : {
        alias: {
            "txt" : "raw-loader"
        }
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: path.join(__dirname, "dist", "index.html"),
        template: path.join(__dirname, "static", "index.html"),
        inject: true,
      }),
      new BundleAnalyzerPlugin({
        reportFilename: "../misc/bundle-stats.html",
        analyzerMode: "server",
        openAnalyzer: true
      })
    ],
};

if (env == "production"){
    webpackConfig.entry = {
        "telechart" : "Telechart/Telechart",
    }

    webpackConfig.optimization = {
      minimize: true,
      minimizer: [new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        terserOptions: {
          ecma: 5,
          warnings: false,
          beautify: true,
          parse: {},
          mangle: true, // Note `mangle.properties` is `false` by default.
          module: true,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false,
          output: {
            preamble: "/* @sanyabeast */",
            // beautify: true
          }
        }
      })]
    }

    // webpackConfig.output.libraryTarget = "web"

    webpackConfig.plugins.push(new JsDocPlugin({
        conf: path.join(__dirname, 'jsdoc.conf'),
    }));
} 

module.exports = webpackConfig