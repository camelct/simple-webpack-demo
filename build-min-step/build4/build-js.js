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

function moduleTreeToQueue(moduleTree) {
  const { deps, ...module } = moduleTree;
  const moduleQueue = deps.reduce(
    (cur, item) => {
      return cur.concat(moduleTreeToQueue(item));
    },
    [module],
  );

  return moduleQueue;
}

const moduleQueue = moduleTreeToQueue(moduleTree);
// *moduleQueue*
// [
//   {
//     id: 0,
//     filename: "D:\\node-webpack-study\\src\\index.js",
//     code: "const sum = require(1);\nconst multi = require(2);",
//   },
//   {
//     id: 1,
//     filename: "D:\\node-webpack-study\\src\\sum.js",
//     code: "module.exports = (...args) => args.reduce((x, y) => x + y, 0);",
//   },
//   {
//     id: 2,
//     filename: "D:\\node-webpack-study\\src\\multi.js",
//     code:
//       "const del = require(3);\n" +
//       "module.exports = (...args) => args.reduce((x, y) => x * y, 0);",
//   },
//   {
//     id: 3,
//     filename: "D:\\node-webpack-study\\src\\del.js",
//     code: "module.exports = (...args) => args.reduce((x, y) => x / y, 0);",
//   },
// ];

const wrapperModuleFn = code => {
  return `(module, __unused_webpack_exports, require) => {
    ${code}
  }`;
};

const modules = moduleQueue.map(item => {
  return `
  ${wrapperModuleFn(item.code)}
  `;
});

/**
 **webpack_module*
 var __webpack_modules__ = [
  ,
  module => {
    module.exports = (...args) => args.reduce((x, y) => x + y, 0);
  },
  (module, __unused_webpack_exports, __webpack_require__) => {
    const del = __webpack_require__(3);
    module.exports = (...args) => args.reduce((x, y) => x * y, 1);
  },
  module => {
    module.exports = (...args) => args.reduce((x, y) => x / y, 1);
  },
];

var __webpack_module_cache__ = {};
function __webpack_require__(moduleId) {
  var cachedModule = __webpack_module_cache__[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = (__webpack_module_cache__[moduleId] = {
    exports: {},
  });

  __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

  return module.exports;
}

var __webpack_exports__ = {};

(() => {
  const sum = __webpack_require__( 1);
  const multi = __webpack_require__(2);

  console.log("test-sum", sum(2, 3));
  console.log("test-multi", multi(2, 3));
})();
 */

const generateBundle = () => {
  return `var __webpack_modules__ = [${modules}];

var __webpack_module_cache__ = {};
function require(moduleId) {
  var cachedModule = __webpack_module_cache__[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = (__webpack_module_cache__[moduleId] = {
    exports: {},
  });

  __webpack_modules__[moduleId](module, module.exports, require);

  return module.exports;
}

var __webpack_exports__ = {};
  
(() => {
 ${moduleQueue[0].code} 
})();
  `;
};

const outputDir = path.join(workDir, "dist");
console.log(generateBundle());
fs.writeFileSync(path.join(outputDir, "bundle.js"), generateBundle());
