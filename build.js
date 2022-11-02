const webpack = require("webpack");

const config1 = {};

const config2 = {
  entry: "./src/index.js",
  mode: "none",
  output: {
    iife: false,
    pathinfo: "verbose",
  },
};

// 基础 base
function fn(config) {
  return webpack(config);
}

fn(config1).run((err, stat) => {
  console.log(stat.toJson());
});
