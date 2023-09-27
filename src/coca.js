import fs from "node:fs";

const readFileLines = (filename) =>
  fs.readFileSync(filename).toString("UTF8").split("\r\n");

export let stopwordsMap = new Map();
export let cocaMap = new Map();

[...new Set(readFileLines("./public/stopwords.txt"))].forEach((item, key) => {
  stopwordsMap.set(item, { index: key });
});

[...new Set(readFileLines("./public/coca.txt"))].forEach((value, index) => {
  cocaMap.set(value, { value, index });
});
