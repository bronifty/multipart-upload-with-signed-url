import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

// Get the current file's directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// const dependencyAsset = import.meta.resolve("./cdk/README.md");
// console.log(dependencyAsset);

// const cdkDir = new URL("./cdk/", import.meta.url);

// function resolveCdk(path = "") {
//   return fileURLToPath(new URL(path, cdkDir));
// }
// const cdkFilePath = resolveCdk("README.md");
// console.log("cdkFilePath", cdkFilePath);

// const reactComponentRegex = /\.jsx$/;

// import.meta.url; // old way
// import.meta.filename; // fileURLToPath(import.meta.url)
// import.meta.dirname; // dirname(import.meta.filename)
// import.meta.resolve(specifier);

// old way to specify an absolute filepath relative to current directory
console.log(
  "old way to specify an absolute filepath relative to current directory: ",
  fileURLToPath(new URL("./cdk/", import.meta.url))
);
// new way to specify an absolute filepath relative to current directory
console.log(
  "new way to specify an absolute filepath relative to current directory",
  `${import.meta.dirname}/cdk`
);
// way to specify a filepath with the file protocol
const fileProtocolSpecifier = import.meta.resolve("./cdk/README.md");
console.log(
  "new way to specify a filepath with the file protocol",
  fileProtocolSpecifier
);
// old way to parameterize a filepath
const cdkDir = new URL("./cdk/", import.meta.url);
function resolveCdk(path = "") {
  return fileURLToPath(new URL(path, cdkDir));
}
const cdkFilePath = resolveCdk("README.md");
console.log("old way to parameterize a filepath", cdkFilePath);
// new way to parameterize a filepath
function resolveCdkMeta(path = "") {
  return import.meta.resolve(path);
}
const cdkFilePathMeta = resolveCdkMeta("./cdk/README.md");
console.log("new way to parameterize a filepath", cdkFilePathMeta);
