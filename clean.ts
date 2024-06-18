import { glob, unlink, rm } from "node:fs/promises";
import fg from "fast-glob";

(async () => {
  for await (const file of fg.stream(`${import.meta.dirname}/**/*`, {
    followSymbolicLinks: true,
  })) {
    console.log(file);
    // Optionally handle node_modules or other specific cases
    if (file.includes("/node_modules/")) {
      await rm(file, { recursive: true, force: true });
    }
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
