import fs from "node:fs";
const readFileLines = (filename) =>
  fs.readFileSync(filename).toString("UTF8").split("\r\n");

export let stopwords = new Set(readFileLines("../public/stopwords.txt"));
export let coca = new Set(readFileLines("../public/coca.txt"));
