const path = require("path");

const appDir = (pathStr = "./") => {
  return path.resolve(`${__dirname}/./app/${pathStr}`);
};

const apiDir = (pathStr = "./") => {
  return path.resolve(`${__dirname}/./api/${pathStr}`);
};

export { appDir, apiDir };
