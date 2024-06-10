import { Readable } from "stream";

export type MPUType = {
  profile: string;
  bucket: string;
  key: string;
  filepath: string;
  readable: Readable;
};
