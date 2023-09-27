import fs from "node:fs";

const readFileLines = (filename) =>
  fs.readFileSync(filename).toString("UTF8").split("\r\n");

export let cocaMap = new Map();

[...new Set(readFileLines("./public/coca.txt"))].forEach((value, index) => {
  cocaMap.set(value, { index });
});
