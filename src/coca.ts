import fs from "node:fs";

const readFileLines = (filename: string) =>
  fs
    .readFileSync(filename)
    .toString("UTF8" as BufferEncoding)
    .split("\r\n");

export let cocaMap = new Map();

[...new Set(readFileLines("./public/coca.txt"))].forEach((value, index) => {
  cocaMap.set(value, { index });
});
