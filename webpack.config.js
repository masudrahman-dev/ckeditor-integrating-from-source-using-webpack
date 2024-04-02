// webpack.config.js

const path = require("path");
const {
  CKEditorTranslationsPlugin,
} = require("@ckeditor/ckeditor5-dev-translations");
const { styles } = require("@ckeditor/ckeditor5-dev-utils");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./main.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  plugins: [
    // Extract CSS into separate files
    new MiniCssExtractPlugin({
      filename: "[name].bundle.css", // Use [name] placeholder to output separate CSS files
    }),
    // Copy index.html to dist folder and inject script tags and link to CSS file
    new HtmlWebpackPlugin({
      template: "./index.html",
      inject: "body", // Inject script tags into the body
    }),
    new CKEditorTranslationsPlugin({
      // See https://ckeditor.com/docs/ckeditor5/latest/features/ui-language.html
      language: "pl",
    }),
  ],
  resolve: {
    extensions: [".ts", ".js", ".json"],
    extensionAlias: {
      ".js": [".js", ".ts"],
    },
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        use: ["ts-loader"],
      },
      {
        test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,

        use: ["raw-loader"],
      },
      {
        // Match files from the `ckeditor5` package but also `ckeditor5-*` packages.
        test: /(ckeditor5(?:-[^\/\\]+)?)[\/\\].+\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [require("@babel/preset-env")],
            },
          },
        ],
      },
      {
        test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,

        use: [
          {
            loader: "style-loader",
            options: {
              injectType: "singletonStyleTag",
              attributes: {
                "data-cke": true,
              },
            },
          },
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: styles.getPostCssConfig({
                themeImporter: {
                  themePath: require.resolve("@ckeditor/ckeditor5-theme-lark"),
                },
                minify: true,
              }),
            },
          },
        ],
      },
    ],
  },
};
