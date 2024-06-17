export async function getPresignedUrls(bucket, key, totalParts) {
  const response = await fetch("http://localhost:3000/getPresignedUrl", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bucket: bucket,
      key: key,
      partCount: totalParts,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get presigned URLs: " + (await response.text()));
  }

  return response.json();
}

export async function uploadPart(url, blob) {
  const response = await fetch(url, {
    method: "PUT",
    body: blob,
    headers: {
      "Content-Type": "application/octet-stream",
    },
  });

  if (!response.ok) {
    throw new Error("Upload failed for part: " + (await response.text()));
  }

  return response.headers.get("ETag");
}

export async function completeUpload(bucket, key, uploadId, parts) {
  await fetch("http://localhost:3000/completeUpload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bucket,
      key,
      uploadId,
      parts,
    }),
  });
}

export async function uploadFile(bucket) {
  console.log("uploadFile() called");
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  const key = file.name;
  const partSize = 5 * 1024 * 1024;
  const totalParts = Math.ceil(file.size / partSize);
  const uploadStatus = document.getElementById("uploadStatus");

  const { uploadId, urls } = await getPresignedUrls(bucket, key, totalParts);
  const parts = [];

  for (let i = 0; i < totalParts; i++) {
    const start = i * partSize;
    const end = (i + 1) * partSize;
    const blob = file.slice(start, end);
    const etag = await uploadPart(urls[i].url, blob);
    parts.push({ ETag: etag, PartNumber: i + 1 });
    uploadStatus.textContent = `Uploaded part ${i + 1} of ${totalParts}`;
  }

  await completeUpload(bucket, key, uploadId, parts);
  uploadStatus.textContent = "File uploaded successfully!";
  alert("File uploaded successfully!");
}
