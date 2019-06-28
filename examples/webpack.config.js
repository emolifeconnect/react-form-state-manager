const resolve = require('path').resolve;

module.exports = {
    entry: [
        './src/index.tsx'
    ],
    output: {
        path: resolve('./'),
        filename: 'public/app.js'
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                include: /src|test/
            },
        ]
    }
};
