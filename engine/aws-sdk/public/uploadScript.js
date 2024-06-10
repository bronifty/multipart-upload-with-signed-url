export async function uploadFile() {
  console.log("uploadFile() called");
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  const partSize = 5 * 1024 * 1024; // 5 MB per part
  const totalParts = Math.ceil(file.size / partSize);
  const bucket = "bronifty-sst"; // Specify your bucket name
  const key = "Archive.zip"; // Specify the object key, e.g., 'uploads/file.zip'

  // Request presigned URLs from the server
  const presignedUrlResponse = await fetch(
    "http://localhost:3000/getPresignedUrl",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bucket: bucket,
        key: key,
        partCount: totalParts,
      }),
    }
  );

  if (!presignedUrlResponse.ok) {
    throw new Error(
      "Failed to get presigned URLs: " + (await presignedUrlResponse.text())
    );
  }

  const { uploadId, urls } = await presignedUrlResponse.json();
  const parts = [];

  // Upload each part using the presigned URLs
  for (let i = 0; i < totalParts; i++) {
    const start = i * partSize;
    const end = (i + 1) * partSize;
    const blob = file.slice(start, end);

    const uploadResponse = await fetch(urls[i].url, {
      method: "PUT",
      body: blob,
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });

    console.log(uploadResponse.headers); // Log headers to see what's included

    if (!uploadResponse.ok) {
      throw new Error(
        "Upload failed for part " +
          (i + 1) +
          ": " +
          (await uploadResponse.text())
      );
    }

    const etag = uploadResponse.headers.get("ETag");
    console.log(`ETag for part ${i + 1}:`, etag); // Check the ETag value
    parts.push({ ETag: etag, PartNumber: i + 1 });
  }

  // Notify the server that all parts are uploaded
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

  alert("File uploaded successfully!");
}

export async function hello() {
  console.log("hello");
}
