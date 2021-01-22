const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
require('colors');

/**
 * 模式
 * @type {'dev'|'build'}
 */
const mode = process.argv[2];
/**
 * 通用配置
 */
let commonConfig = {
    entry: ['./src/index.js'],
    devtool: mode === 'dev' ? 'inline-source-map' : undefined,
    mode: mode === 'dev' ? 'development' : 'production',
    output: {
        filename: 'gltfviewer/gltfviewer.js',
        library: 'gltfviewer',
        libraryTarget: 'umd',
        path: path.resolve('./', 'dist')
    },
    performance: {
        hints: false
    },
    plugins: [
        new VueLoaderPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env' //  转换es6 -> es5
                    ],
                    plugins: [
                        [
                            "component",
                            {
                                "libraryName": "element-ui",
                                "styleLibraryName": "theme-chalk"
                            }
                        ],
                        ["@babel/plugin-proposal-decorators", { "legacy": true }],  //  转换@装饰器
                        ["@babel/plugin-proposal-class-properties", { "loose": true }],  //  转换class语法
                        ["@babel/plugin-transform-runtime"]   // 特殊语法'aa'.includes('a'); 在require('@babel/polyfill')
                    ]
                },
                include: path.resolve('./', 'src'),
                exclude: '/node_modules/'
            },
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            esModule: false //必须设置false
                        }
                    }
                ]
            },
            {
                test: /\.(woff|ttf)$/,
                loader: 'file-loader',
                options: {
                    name: 'gltfviewer/fonts/[name].[ext]'
                }
            },
            {
                test: /\.(txt|glsl|vert|frag|shader)$/i,
                use: 'raw-loader',
            },
        ]
    }
};

mode === 'dev' ? dev() : build();

function dev() {
    const port = 8080;
    let devConfig = {
        static: path.resolve('./', 'dist'),
        port: port,
        hot: true
    };
    let compiler = webpack(commonConfig);
    //文件写入磁盘
    compiler.hooks.watchRun.tap('watchRun', () => {
        white('开始编译');
    });
    compiler.hooks.failed.tap('failed', error => {
        red(`编译时发生错误，错误信息：${error}`);
    });
    compiler.hooks.emit.tap('emit', (compilation, callback) => {
        const assets = compilation.assets;
        let file, data;
        Object.keys(assets).forEach(key => {
            if (!key.startsWith('gltfviewer/')) return;//只写入js文件
            file = path.resolve('./', 'dist', key);
            data = assets[key].source();
            fs.writeFileSync(file, data);
        });
        callback && callback();
    });
    compiler.hooks.afterEmit.tap('afterEmit', () => {
        green('编译成功');
    });
    const server = new WebpackDevServer(compiler, devConfig);
    server.listen(port);
}
function build() {
    white('开始编译');
    webpack(commonConfig, stats => {
        if (stats) {
            red(`编译发生错误，错误信息：${stats}`);
        }
        else {
            green('编译成功');
        }
    });
}

function green(msg) {
    console.log(`--------------------${msg}--------------------`.green);
}
function red(msg) {
    console.log(`--------------------${msg}--------------------`.red);
}
function white(msg) {
    console.log(`--------------------${msg}--------------------`.white);
}