export type MPUResponse = {
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
