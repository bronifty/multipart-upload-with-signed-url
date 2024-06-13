import React, { useState, useCallback } from "react";
import { uploadFile } from "./script"; // Adjust the import path as necessary

const FileUpload = ({ bucket }: { bucket: string }) => {
  const [fileName, setFileName] = useState("");

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      uploadFile(bucket);
    }
  };

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length) {
        const file = files[0];
        setFileName(file.name);
        uploadFile(bucket);
      }
    },
    [bucket]
  );

  return (
    <div>
      <div
        id="dropZone"
        onDrop={onDrop}
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        Drag and drop your file here or click to select
      </div>
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={onFileChange}
      />
      <span id="fileName">{fileName ? `Selected file: ${fileName}` : ""}</span>
    </div>
  );
};

export default FileUpload;
