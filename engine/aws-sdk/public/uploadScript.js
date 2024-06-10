export async function uploadFile() {
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

  // Upload each part using the presigned URLs
  for (let i = 0; i < totalParts; i++) {
    const start = i * partSize;
    const end = (i + 1) * partSize;
    const blob = file.slice(start, end);

    const uploadResponse = await fetch(urls[i].url, {
      method: "PUT",
      body: blob,
    });

    if (!uploadResponse.ok) {
      throw new Error(
        "Upload failed for part " +
          (i + 1) +
          ": " +
          (await uploadResponse.text())
      );
    }
  }

  // Notify the server that all parts are uploaded
  await fetch("http://localhost:3000/completeUpload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bucket: bucket,
      key: key,
      uploadId: uploadId,
    }),
  });

  alert("File uploaded successfully!");
}
