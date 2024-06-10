import { Readable } from "stream";

export type MPUType = {
  profile: string;
  bucket: string;
  key: string;
  file: Readable;
};
