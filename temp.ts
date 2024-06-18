import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

// Get the current file's directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__dirname, __filename);

const dependencyAsset = import.meta.resolve("./cdk/README.md");
console.log(dependencyAsset);

// file:///app/node_modules/component-lib/asset.css
// import.meta.resolve("./dep.js");
// file:///app/dep.js
