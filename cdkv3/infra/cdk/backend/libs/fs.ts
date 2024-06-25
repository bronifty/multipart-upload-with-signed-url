const path = require("path");

const cjsDir = (pathStr = "./") => {
  return path.resolve(__dirname, pathStr);
};

export { cjsDir };
