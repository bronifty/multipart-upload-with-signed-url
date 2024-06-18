import { glob, rm, lstat } from "node:fs/promises";

(async () => {
  const directories = new Set();
  // Collect all paths that might contain node_modules
  for await (const file of glob(`${import.meta.dirname}/**/*`)) {
    if (file.includes("/node_modules/")) {
      const stats = await lstat(file);
      if (stats.isDirectory()) {
        // This will capture the path up to and including 'node_modules'
        const dirPath = file.split("/node_modules")[0] + "/node_modules";
        directories.add(dirPath);
      }
    }
  }
  // Now, remove each collected directory
  for (const dir of directories) {
    console.log(`Removing directory: ${dir}`);
    await rm(dir, { recursive: true, force: true });
  }
})();
// import fg from "fast-glob";

// (async () => {
//   const directories = new Set();

//   // First, collect all directories that contain 'node_modules'
//   for await (const file of fg.stream(
//     `${import.meta.dirname}/**/node_modules/**/*`,
//     {
//       onlyDirectories: true,
//       followSymbolicLinks: true,
//     }
//   )) {
//     // This will capture the path up to and including 'node_modules'
//     const dirPath = file.split("/node_modules")[0] + "/node_modules";
//     directories.add(dirPath);
//   }

//   // Now, remove each collected directory
//   for (const dir of directories) {
//     console.log(`Removing directory: ${dir}`);
//     await rm(dir, { recursive: true, force: true });
//   }
// })();

// (async () => {
//   const files = await fg(`${import.meta.dirname}/**/*`, {
//     followSymbolicLinks: true,
//   });
//   files.forEach((file) => console.log(file));
// })();
// (async () => {
//   const directories = new Set();
//   // collect all directories that contain node_modules
//   for await (const file of glob(`${import.meta.dirname}/**/*`)) {
//     // This will capture the path up to and including 'node_modules'
//     const dirPath = file.split("/node_modules")[0] + "/node_modules";
//     directories.add(dirPath);
//   }
//   // Now, remove each collected directory
//   for (const dir of directories) {
//     console.log(`Removing directory: ${dir}`);
//     await rm(dir, { recursive: true, force: true });
//   }
// })();
