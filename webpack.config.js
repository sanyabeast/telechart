const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const env = process.env.NODE_ENV;

let webpackConfig = {
    devtool: "cheap-module-eval-source-map",
    mode: env,
  	output: {
  	  filename: "[name].js",
  	  path: path.resolve(__dirname, "dist"),
  	  libraryTarget: "umd",
  	},
  	module : {
  		rules : [
  			  {
	            test: /\.(js$)/,
              // exclude: /(node_modules)/,
	            use: [{
	                loader: "babel-loader",
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
        inject: env == "development",
      }),
      new BundleAnalyzerPlugin({
        reportFilename: "../misc/bundle-stats.html",
        analyzerMode: "static",
        openAnalyzer: false
      })
    ],
    optimization: {
	    minimize: false
	}
};

if (env == "production"){
    webpackConfig.entry = {
        "telechart" : "Telechart/Telechart",
    }
} else {
    webpackConfig.entry = {
        "main" : "main",
    }
}

module.exports = webpackConfig