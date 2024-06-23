const path = require("path");

export const cjsDir = (pathStr = "./") => {
  return path.resolve(__dirname, pathStr);
};

console.log(cjsDir("./"));
