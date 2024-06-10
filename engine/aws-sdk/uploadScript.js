async function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  const partSize = 5 * 1024 * 1024; // 5 MB per part
  const totalParts = Math.ceil(file.size / partSize);

  for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
    const start = (partNumber - 1) * partSize;
    const end = partNumber * partSize;
    const blob = file.slice(start, end);

    // Request a presigned URL from the server for this part
    const response = await fetch(
      `https://yourserver.com/getPresignedUrl?partNumber=${partNumber}&totalParts=${totalParts}`
    );
    const { url } = await response.json();

    // Use the presigned URL to upload the part
    const uploadResponse = await fetch(url, {
      method: "PUT",
      body: blob,
    });

    if (!uploadResponse.ok) {
      throw new Error("Upload failed: " + (await uploadResponse.text()));
    }
  }

  // Notify the server that all parts are uploaded
  await fetch("https://yourserver.com/completeUpload", {
    method: "POST",
    body: JSON.stringify({ totalParts }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  alert("File uploaded successfully!");
}
