const path = require("path");

const cdkDir = (pathStr = "./") => {
  return path.resolve(`${__dirname}/../cdk/${pathStr}`);
};
const distDir = (pathStr = "./") => {
  return path.resolve(`${__dirname}/../dist/${pathStr}`);
};

const appDir = (pathStr = "./") => {
  return path.resolve(`${__dirname}/../app/${pathStr}`);
};

const apiDir = (pathStr = "./") => {
  return path.resolve(`${__dirname}/../api/${pathStr}`);
};

export { cdkDir, distDir, appDir, apiDir };
