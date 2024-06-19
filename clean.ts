import { glob, rm, lstat } from "node:fs/promises";

(async () => {
  const directories = new Set();
  // Use a more inclusive glob pattern and log each file path
  for await (const file of glob(`${import.meta.dirname}/**`, {
    nodir: false,
  })) {
    console.log(`Checking file: ${file}`); // Log each file path being checked
    if (
      file.includes("/node_modules/") ||
      file.includes("/cdk.out/") ||
      file.includes("/dist/")
    ) {
      const stats = await lstat(file);
      if (stats.isDirectory() || file.endsWith("synth.lock")) {
        // Check if it's a directory or the specific file
        const dirPath =
          file.split(/\/(node_modules|cdk.out|dist)\//)[0] +
          file.match(/\/(node_modules|cdk.out|dist)\//)[0];
        directories.add(dirPath);
        console.log(`Directory added for removal: ${dirPath}`); // Log directory added for removal
      } else {
        console.log(`Not a directory or not matching criteria: ${file}`); // Log files that are not directories or don't match the criteria
      }
    }
  }
  // Now, remove each collected directory
  for (const dir of directories) {
    console.log(`Attempting to remove directory: ${dir}`);
    try {
      await rm(dir, { recursive: true, force: true });
      console.log(`Successfully removed: ${dir}`);
    } catch (error) {
      console.error(`Failed to remove ${dir}: ${error}`); // Detailed error logging
    }
  }
})();
