import { cjsDir } from "../utils/fs";

const fs = require("fs");
const notesApiListPath = cjsDir("./cdk/aws-sdk-js-notes-app-stack.ts");
const notesApiListContent = fs.readFileSync(notesApiListPath, "utf8");
console.log(notesApiListContent);

console.log(cjsDir("./cdk/aws-sdk-js-notes-app-stack.ts"));
