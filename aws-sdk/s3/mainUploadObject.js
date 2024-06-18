import * as fs from "fs";
import { uploadObject } from ".";
const config = {
    profile: "sst",
    bucket: "bronifty-sst",
    key: "Archive.zip",
    filepath: "/Users/bro/Documents/Archive.zip",
    readable: fs.createReadStream("/Users/bro/Documents/Archive.zip"),
};
uploadObject(config);
