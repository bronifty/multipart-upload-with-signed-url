import { exec } from "child_process";
import { existsSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
function metaPath(path = "") {
  return `${import.meta.dirname}/${path}`;
}

(async () => {
  const cdkOutputsFile = metaPath(
    `tmp.${Math.ceil(Math.random() * 10 ** 10)}.json`
  );
  const configEnv = metaPath("../frontend/.env");

  try {
    const execProcess = exec(
      `pnpm --prefix ${metaPath(
        "../infra"
      )} cdk deploy --outputs-file ${cdkOutputsFile}`
    );
    execProcess.stdout.pipe(process.stdout);
    execProcess.stderr.pipe(process.stderr);
    await new Promise((resolve) => {
      execProcess.on("exit", resolve);
    });
  } catch (error) {
    console.log(`cdk command failed: ${error}`);
  }

  // Populate frontend config with data from outputsFile
  try {
    const cdkOutput = JSON.parse(readFileSync(cdkOutputsFile))[
      "aws-sdk-js-notes-app"
    ];
    const config = {
      VITE_FILES_BUCKET: cdkOutput.FilesBucket,
      VITE_GATEWAY_URL: cdkOutput.GatewayUrl,
      VITE_IDENTITY_POOL_ID: cdkOutput.IdentityPoolId,
      VITE_REGION: cdkOutput.Region,
    };
    writeFileSync(
      configEnv,
      Object.entries(config)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n")
    );
  } catch (error) {
    console.log(`Error while updating .env: ${error}`);
  }

  // const cdkOutputsFile = "./scripts/tmp.3702436577.json"; // Adjust the path as necessary

  try {
    if (existsSync(cdkOutputsFile)) {
      unlinkSync(cdkOutputsFile);
    } else {
      console.log("Temporary file does not exist, no need to delete.");
    }
  } catch (error) {
    console.error("Error while deleting temporary file:", error);
  }
  // Delete outputsFile
  // unlinkSync(cdkOutputsFile);
})();
