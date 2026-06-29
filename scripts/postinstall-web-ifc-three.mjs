import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const targetPath = resolve("node_modules", "web-ifc-three", "IFCLoader.js");
const legacyImport = "import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';";
const patchedImport =
  "import { mergeBufferGeometries as mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';";

if (!existsSync(targetPath)) {
  process.exit(0);
}

const source = readFileSync(targetPath, "utf8");

if (source.includes(patchedImport)) {
  process.exit(0);
}

if (!source.includes(legacyImport)) {
  throw new Error("Expected web-ifc-three import not found. Update the postinstall patch script.");
}

writeFileSync(targetPath, source.replace(legacyImport, patchedImport), "utf8");
console.log("Patched web-ifc-three IFCLoader import for current Three.js compatibility.");
