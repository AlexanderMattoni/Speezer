var webpack = require("webpack");
var path = require("path");
var _ = require('lodash');
var minimist = require('minimist');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var DEFAULT_TARGET = 'BUILD-DEV';

var DEFAULT_PARAMS = {
    "cache": true,
    "module": {
        preLoaders: [
            {
                test: /\.ts$/,
                loader: "tslint"
            }
        ],
        "loaders": [
            {
                test: /\.tsx?$/,
                loader: 'babel!ts-loader?configFileName=app/tsconfig.json'
            },
            {
                test: /\.umd.js?$/,
                loader: 'babel?presets[]=es2015'
            },
            {
                test: /\.(jpe?g|png|gif|svg|ico)$/i,
                loaders: [
                    'file?hash=sha512&digest=hex&name=img/[name].[ext]'
                ]
            },
            {
                test: /(pixi|phaser).js/,
                loader: 'script'// script-loader
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass")
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            }
        ]
    },
    "resolve": {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    devServer: {
        publicPath: "/",
        contentBase: "build/",
        historyApiFallback: true
    },
    progress: false,
    "output": {
        "path": "build",
        "publicPath": "/",
        "filename": "js/bin.js"
    },
    tslint: {
        failOnHint: true,
        configuration: require('./tslint.json')
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development'),
                'BLUEBIRD_WARNINGS': 0
            }
        }),
        new webpack.ProvidePlugin({
            Promise: "bluebird"
        }),

        new ExtractTextPlugin("css/style.css")
    ]
};

var PARAMS_PER_TARGET = {

    "BUILD-DEV": {
        devtool: 'inline-source-map',
        "entry": {
            app: "./src/init.ts"
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'We Are Not In Space',
                version: require("./package.json").version,
                hash: "true",
                template: "./resources/html/index.html"
            })
        ]
    },

    "BUILD-PROD": {
        "entry": {
            app: "./src/init.ts"
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'We Are Not In Space',
                version: require("./package.json").version,
                hash: "true",
                template: "./resources/html/index.html"
            })
        ]
    }
};

var target = _resolveBuildTarget(DEFAULT_TARGET);
var params = _.merge(DEFAULT_PARAMS, PARAMS_PER_TARGET[target], _mergeArraysCustomizer);

module.exports = params;


function _resolveBuildTarget(defaultTarget) {
    var target = minimist(process.argv.slice(2)).TARGET;
    if (!target) {
        console.log('No build target provided, using default target instead\n\n');
        target = defaultTarget;
    }
    return target;
}

function _mergeArraysCustomizer(a, b) {
    if (_.isArray(a)) {
        return a.concat(b);
    }
}
