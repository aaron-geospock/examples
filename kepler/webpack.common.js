const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const {ProgressPlugin} = require("webpack");

const outputPath = path.resolve(__dirname, "dist");

module.exports = {
    entry: [
        "@babel/polyfill",
        "./src/js/integration-kepler.js",
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === "development",
                        }
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            sourceMap: true,
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            config: {
                                path: path.join(__dirname, "postcss.config.js"),
                            },
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
                loader: "url-loader",
                options: {
                    limit: 8192,
                },
            },
        ]
    },
    output: {
        filename: "main.js",
        path: outputPath,
    },
    plugins: [
        new ProgressPlugin(),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, "src", "resources"),
                to: outputPath,
            },
        ]),
        new HtmlWebpackPlugin({
            template: "src/index.ejs",
            title: "GeoSpock Integrations: Kepler",
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new StylelintPlugin({
            files: "src/**/*.css",
        }),
    ],
};
