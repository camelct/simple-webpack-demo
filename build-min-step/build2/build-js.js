const path = require("node:path");
const fs = require("node:fs");

const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;

const workDir = path.join(__dirname, "../../");

const aimJsFilename = path.join(workDir, "src", "index.js");

let moduleId = 0;

const buildModule = filename => {
  // 获取文件绝对路径
  filename = path.resolve(__dirname, filename);

  const code = fs.readFileSync(filename, "utf8");

  // 使用 babel 解析源码为 AST
  const ast = parse(code, {
    sourceType: "module",
  });

  // 深度遍历
  const deps = [];
  const curModuleId = moduleId;

  traverse(ast, {
    enter({ node, parentPath }) {
      // 根据 AST 定位到所有的 require 函数，寻找出所有的依赖
      if (node.type === "CallExpression") {
        if (node.callee.name === "require") {
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
            argument.value = moduleId;
            // const module = await buildModule(nextFilename);
            const module = buildModule(nextFilename);
            deps.push(module);
          }
        } else if (
          node.callee.type === "MemberExpression" &&
          node.callee.object.name === "console"
        ) {
          parentPath.remove();
        }
      }
    },
  });

  return {
    id: curModuleId,
    deps,
    filename,
    code: generate(ast).code,
  };
};

const moduleTree = buildModule(aimJsFilename);
console.log("test-moduleTree", JSON.stringify(moduleTree, null, " "));
// *moduleTree*
// {
//   id: 0,
//   deps: [
//     {
//       id: 1,
//       deps: [],
//       filename: "D:\\node-webpack-study\\src\\sum.js",
//       code: "module.exports = (...args) => args.reduce((x, y) => x + y, 0);",
//     },
//     {
//       id: 2,
//       deps: [
//         {
//           id: 3,
//           deps: [],
//           filename: "D:\\node-webpack-study\\src\\del.js",
//           code: "module.exports = (...args) => args.reduce((x, y) => x / y, 0);",
//         },
//       ],
//       filename: "D:\\node-webpack-study\\src\\multi.js",
//       code: "const del = require(3);\nmodule.exports = (...args) => args.reduce((x, y) => x * y, 0);",
//     },
//   ],
//   filename: "D:\\node-webpack-study\\src\\index.js",
//   code: "const sum = require(1);\nconst multi = require(2);",
// };
