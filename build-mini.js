const path = require("node:path");
const fs = require("node:fs/promises");

const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const aimFilename = "./src/index.js";

const filename = path.resolve(__dirname, aimFilename);

let moduleId = 0;

(async () => {
  const code = await fs.readFile(filename, "utf8");

  // 使用 babel 解析源码为 AST
  const ast = parse(code, {
    sourceType: "module",
  });

  traverse(ast, {
    enter({ node, ...rest }) {
      console.log("--------");
      // 根据 AST 定位到所有的 require 函数，寻找出所有的依赖
      if (node.type === "CallExpression" && node.callee.name === "require") {
        const argument = node.arguments[0];

        // 找到依赖的模块名称
        // require('lodash') -> lodash (argument.value)
        if (argument.type === "StringLiteral") {
          // 深度优先搜索，当寻找到一个依赖时，则 moduleId 自增一
          // 并深度递归进入该模块，解析该模块的模块依赖树
          moduleId++;
          const nextFilename = path.join(
            path.dirname(filename),
            argument.value,
          );

          // 如果 lodash 的 moduleId 为 3 的话
          // require('lodash') -> require(3)
          // argument.value = moduleId;
          // deps.push(buildModule(nextFilename));
        }
      }

      if (node.type === "CallExpression" && node.callee.object.name === "console") {
        console.log("test=====");
        console.log("test-node", node);
      }
    },
  });
})();
