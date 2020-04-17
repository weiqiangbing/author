// const path = require('path')
const config = require('./src/lib/config')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : './' ,
    // publicPath: process.env.NODE_ENV === 'production' ? '/public/' : './',
    outputDir: config.buildPageName,
    /* 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录 */
    assetsDir: config.buildStaticName,
    /* 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度 */
    productionSourceMap: false,
    /* 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存，你可以通过将这个选项设为 false 来关闭文件名哈希。(false的时候就是让原来的文件名不改变) */
    // filenameHashing: false,
    /* 代码保存时进行eslint检测 */
    lintOnSave: false,
    /* webpack-dev-server 相关配置 */
    devServer: {
        disableHostCheck: true,
        // https: true,
        // open: true,
        /* 设置为0.0.0.0则所有的地址均能访问 */
        host: '0.0.0.0',
        port: 8085,
        // https: false,
        hotOnly: false,
        /* 使用代理 */
        proxy: {
            '/api': {
                /* 目标代理服务器地址 */
                // target: 'http://cqscrest.dmw11.com/',
                // target: 'https://hw-cqscrest.damowang.com/',
                target: 'http://hrxsrest.liwenhua.moqing.com/',
                /* 允许跨域 */
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                "^/api" : ''
                }
            },
        },
    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [
                './src/assets/css/global.less',
            ],
        },
    },
    pages:{
        login: {
            // page 的入口
            entry: 'src/views/login/main.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'login.html',
            title: 'login',
            // chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        myNovels: {
            entry: 'src/views/myNovels/main.js',
            template: 'public/index.html',
            filename: 'myNovels.html',
            title: 'My Novels',
        },
        test: {
            entry: 'src/views/test/main.js',
            template: 'public/index.html',
            filename: 'test.html',
            title: 'test',
        },
        editNovel: {
            entry: 'src/views/editNovel/main.js',
            template: 'public/index.html',
            filename: 'editNovel.html',
            title: 'Edit Novels',
        },
        addNovel: {
            entry: 'src/views/addNovel/main.js',
            template: 'public/index.html',
            filename: 'addNovel.html',
            title: 'Add Novels',
        },
        editChapter: {
            entry: 'src/views/editChapter/main.js',
            template: 'public/index.html',
            filename: 'editChapter.html',
            title: 'Edit Content',
        },
        viewChapter: {
            entry: 'src/views/viewChapter/main.js',
            template: 'public/index.html',
            filename: 'viewChapter.html',
            title: 'View',
        },
    }
}
