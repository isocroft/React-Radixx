var path = require('path');
var webpack = require('webpack');
var env = require('yargs').argv.env; // use --env with webpack 2
var pkg = require('./package.json');


var libraryName = pkg.name, plugins = [], outputFile, mode;

if (env === 'build') {

  	outputFile = libraryName + '.umd.min.js';
  	mode = 'production';
  
} else if(env === 'dev') {

  	outputFile = libraryName + '.umd.js';
	  mode = 'development';
}

module.exports = {
	mode: mode,
	entry:path.resolve(__dirname, './src/es/compositionBridges.js'),
	output:{
	    	path: path.resolve(__dirname, './dist'),
	    	filename:outputFile,
	    	library: libraryName,
	    	libraryTarget: 'umd',
	    	umdNamedDefine: true
	},
	module:{
		rules: [
		      {
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: /node_modules/
		      }/*,
		      {
			test: /\.js$/,
			loader: 'eslint-loader',
			exclude: /node_modules/
		      }*/
		]
	},
  	resolve: {
    	modules: [
    		path.resolve('./node_modules'), 
    		path.resolve('./src')
		],
		extensions: [
			'.json',
			 '.js'
		]
  	},
	performance: {
	  	hints: false
	},
	devtool: 'source-map'
};
