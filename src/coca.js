import fs from "node:fs";
const readFileLines = (filename) =>
  fs.readFileSync(filename).toString("UTF8").split("\r\n");

export let stopwords = new Set(readFileLines("./src/stopwords.txt"));
export let coca = new Set(readFileLines("./src/coca.txt"));
