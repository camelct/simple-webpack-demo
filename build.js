const webpack = require("webpack");
const path = require("node:path");
const { VueLoaderPlugin } = require("vue-loader");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");

// 初始
const config1 = {};

// 还原成可看懂的
const config2 = {
  entry: "./src/index.js",
  mode: "none",
  output: {
    iife: false,
    pathinfo: "verbose",
  },
};

// 增加 css-loader 解析 css
// 无法插入到HTML中
const config3 = {
  entry: "./src/main.js",
  mode: "none",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
    iife: false,
    pathinfo: "verbose",
  },
  module: {
    rules: [
      {
        test: /.css$/,
        use: [{ loader: "css-loader" }],
      },
    ],
  },
};

// 将css加入到 HTML 中
const config4 = {
  entry: "./src/main.js",
  mode: "none",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
    ],
  },
};

// 解析 less
const config5 = {
  entry: "./src/main.js",
  mode: "none",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
    ],
  },
};

// 为postcss-loader 增加 autoprefixer 来自动处理前缀
const config6 = {
  entry: "./src/main.js",
  mode: "none",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: { plugins: ["autoprefixer"] },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: { plugins: ["autoprefixer"] },
            },
          },
          "less-loader",
        ],
      },
    ],
  },
};

// 增加 postcss-loader，处理更多css相关内容 (配置在 postcss.config.js)
const config7 = {
  entry: "./src/main.js",
  mode: "none",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
      },
    ],
  },
};

// 增加资源 asset
const config8 = {
  entry: "./src/main.js",
  mode: "none",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        // type: "asset/resource", // 默认方式，复制图片
        // type: "asset/inline", // base64编码，并将编码后的源码直接放到打包好的js中
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 60 * 1024, // 1 * 1024 => 1KB
          },
        },
        generator: {
          filename: "assets/[name]_[hash:8][ext]",
        },
      },
    ],
  },
};

// 使用 babel 解析 js
const config9 = {
  entry: "./src/main.js",
  mode: "none",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        // type: "asset/resource", // 默认方式，复制图片
        // type: "asset/inline", // base64编码，并将编码后的源码直接放到打包好的js中
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 60 * 1024, // 1 * 1024 => 1KB
          },
        },
        generator: {
          filename: "assets/[name]_[hash:8][ext]",
        },
      },
      {
        test: /\.js$/,
        use: ["babel-loader"],
        // use: [
        //   {
        //     loader: "babel-loader",
        //     options: {
        //       plugins: ["@babel/plugin-transform-block-scoping"],
        //     },
        //   },
        // ],
      },
    ],
  },
};

// 支持 vue
const config10 = {
  entry: "./src/main.js",
  mode: "production",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 60 * 1024, // 1 * 1024 => 1KB
          },
        },
        generator: {
          filename: "assets/[name]_[hash:8][ext]",
        },
      },
      {
        test: /\.js$/,
        use: ["babel-loader"],
      },
      {
        test: /\.vue$/,
        use: ["vue-loader"],
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
};

// 支持后缀名
const config11 = {
  entry: "./src/main.js",
  mode: "production",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 60 * 1024, // 1 * 1024 => 1KB
          },
        },
        generator: {
          filename: "assets/[name]_[hash:8][ext]",
        },
      },
      {
        test: /\.js$/,
        use: ["babel-loader"],
      },
      {
        test: /\.vue$/,
        use: ["vue-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".json", ".vue", "ts"],
  },
  plugins: [new VueLoaderPlugin()],
};

// 支持 alias 别名
const config12 = {
  entry: "./src/main.js",
  mode: "production",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 60 * 1024, // 1 * 1024 => 1KB
          },
        },
        generator: {
          filename: "assets/[name]_[hash:8][ext]",
        },
      },
      {
        test: /\.js$/,
        use: ["babel-loader"],
      },
      {
        test: /\.vue$/,
        use: ["vue-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".json", ".vue", "ts"],
    alias: {
      utils: path.resolve(__dirname, "./src/utils"),
    },
  },
  plugins: [new VueLoaderPlugin()],
};

// 清理文件 cleanWebpackPlugin
const config13 = {
  entry: "./src/main.js",
  mode: "production",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 60 * 1024, // 1 * 1024 => 1KB
          },
        },
        generator: {
          filename: "assets/[name]_[hash:8][ext]",
        },
      },
      {
        test: /\.js$/,
        use: ["babel-loader"],
      },
      {
        test: /\.vue$/,
        use: ["vue-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".json", ".vue", "ts"],
    alias: {
      utils: path.resolve(__dirname, "./src/utils"),
    },
  },
  plugins: [new VueLoaderPlugin(), new CleanWebpackPlugin()],
};

// 生成 html HtmlWebpackPlugin
const config14 = {
  entry: "./src/main.js",
  mode: "production",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 60 * 1024, // 1 * 1024 => 1KB
          },
        },
        generator: {
          filename: "assets/[name]_[hash:8][ext]",
        },
      },
      {
        test: /\.js$/,
        use: ["babel-loader"],
      },
      {
        test: /\.vue$/,
        use: ["vue-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".json", ".vue", "ts"],
    alias: {
      utils: path.resolve(__dirname, "./src/utils"),
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),

    // new HtmlWebpackPlugin()
    new HtmlWebpackPlugin({
      title: "自定义标题",
      template: "./public/template.html",
    }),
  ],
};

// 定义全局变量 DefinePlugin
const config15 = {
  entry: "./src/main.js",
  mode: "production",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 60 * 1024, // 1 * 1024 => 1KB
          },
        },
        generator: {
          filename: "assets/[name]_[hash:8][ext]",
        },
      },
      {
        test: /\.js$/,
        use: ["babel-loader"],
      },
      {
        test: /\.vue$/,
        use: ["vue-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".json", ".vue", "ts"],
    alias: {
      utils: path.resolve(__dirname, "./src/utils"),
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),

    // new HtmlWebpackPlugin()
    new HtmlWebpackPlugin({
      title: "自定义标题",
      template: "./public/template.html",
    }),

    new DefinePlugin({
      BASE_URL: '"./"',
      GLOBAL_SELF: "(1+2).toString()",
    }),
  ],
};

// webpack dev server
const config16 = {
  entry: "./src/main.js",
  mode: "development",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 60 * 1024, // 1 * 1024 => 1KB
          },
        },
        generator: {
          filename: "assets/[name]_[hash:8][ext]",
        },
      },
      {
        test: /\.js$/,
        use: ["babel-loader"],
      },
      {
        test: /\.vue$/,
        use: ["vue-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".json", ".vue", "ts"],
    alias: {
      utils: path.resolve(__dirname, "./src/utils"),
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),

    // new HtmlWebpackPlugin()
    new HtmlWebpackPlugin({
      title: "自定义标题",
      template: "./public/template.html",
    }),

    new DefinePlugin({
      BASE_URL: '"./"',
      GLOBAL_SELF: "(1+2).toString()",
    }),
  ],
  devServer: {
    // host: "0.0.0.0",
    port: 9000,
    compress: true, // 压缩 gzip
    open: true, // 打开浏览器
    hot: true, // 开启热更新 (默认为true)
  },
};

function fn(config) {
  return webpack(config);
}

fn(config16).run((err, stat) => {
  if (err) console.log("err", err);
});

module.exports = config16;
