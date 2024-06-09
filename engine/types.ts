export type MPUResponse = {
  ServerSideEncryption: string;
  Bucket: string;
  Key: string;
  UploadId: string;
};

export type MPUConfig = {
  profileName: string;
  bucketName: string;
  keyName: string;
  uploadId: string;
};