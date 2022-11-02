const path = require("node:path");
const fs = require("node:fs/promises");

const aimCssFilename = './index.css'

const filename = path.resolve(__dirname, aimCssFilename);

(async () => {
  const code = await fs.readFile(filename, "utf8");

  console.log('test-code', code)
  // 使用 babel 解析源码为 AST
  // TODO css
})();
