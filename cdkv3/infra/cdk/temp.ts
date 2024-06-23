import { cjsDir } from "./backend/libs/fs";

const fs = require("fs");
const notesApiListPath = cjsDir("../notes-api.list.ts");
const notesApiListContent = fs.readFileSync(notesApiListPath, "utf8");
console.log(notesApiListContent);

console.log(cjsDir("../notes-api.list.ts"));
