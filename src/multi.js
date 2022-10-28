const del = require("./del.js");

console.log("test-del", del(2, 1));

module.exports = (...args) => args.reduce((x, y) => x * y, 0);
