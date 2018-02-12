module.exports = {
    watch: true,
    entry: './src/parallax_background.es6',
    output: {
        filename: 'build/parallax_background.js'
    },
    module: {
        rules: [
            {
                test: /\.es6$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    }
};