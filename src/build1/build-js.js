const path = require("node:path");
const fs = require("node:fs/promises");

const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const aimJsFilename = "./index.js";
const filename = path.resolve(__dirname, aimJsFilename);

(async () => {
  const code = await fs.readFile(filename, "utf8");

  // 使用 babel 解析源码为 AST
  const ast = parse(code, {
    sourceType: "module",
  });

  traverse(ast, {
    enter({ node }) {
      console.log("node", node);
    },
  });
})();
