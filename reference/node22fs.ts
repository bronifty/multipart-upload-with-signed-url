// node v22 fs functions:
// import.meta.dirname; // current directory
// import.meta.filename; // current filepath
// import.meta.resolve(filepath); // file:// protocol

// resolve a file relative to a directory - old way
import { fileURLToPath } from "node:url";
const cdkDir = new URL("./cdk/", import.meta.url);
function resolveCdk(path = "") {
  return fileURLToPath(new URL(path, cdkDir));
}
console.log("resolveCdk", resolveCdk("README.md"));

// resolve a file relative to a directory - new way
function metaDirname(path = "") {
  return `${import.meta.dirname}/${path}`;
}
console.log("metaDirname", metaDirname("cdk/README.md"));
