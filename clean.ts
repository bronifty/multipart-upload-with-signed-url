import { glob, unlink, rm } from "node:fs/promises";
import fg from "fast-glob";

(async () => {
  const directories = new Set();

  // First, collect all directories that contain 'node_modules'
  for await (const file of fg.stream(
    `${import.meta.dirname}/**/node_modules/**/*`,
    {
      onlyDirectories: true,
      followSymbolicLinks: true,
    }
  )) {
    // This will capture the path up to and including 'node_modules'
    const dirPath = file.split("/node_modules")[0] + "/node_modules";
    directories.add(dirPath);
  }

  // Now, remove each collected directory
  for (const dir of directories) {
    console.log(`Removing directory: ${dir}`);
    await rm(dir, { recursive: true, force: true });
  }
})();

// (async () => {
//   const files = await fg(`${import.meta.dirname}/**/*`, {
//     followSymbolicLinks: true,
//   });
//   files.forEach((file) => console.log(file));
// })();

// for await (const file of glob(`${import.meta.dirname}/**/*`)) {
//   console.log(file);
//     if (file.includes("/node_modules/")) {
//       await rm(file, { recursive: true, force: true });
//     }
// }
