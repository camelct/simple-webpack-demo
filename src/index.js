const sum = require("./sum.js");
const multi = require("./multi.js");
// test comment
/**
 * multi comment
 */
console.log("test-sum", sum(2, 3));
console.log("test-multi", multi(2, 3));

console.warn("test-warn", "这是警告");
console.error("test-error", "这是错误");

function log_fn() {
  console.time("time");
  const a = 1;
  console.timeEnd("time");
}

const log_fn_const = () => {
  const b = 2;
};
