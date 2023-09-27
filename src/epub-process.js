import { parseEpub } from "@gxl/epub-parser";
import nlp from "compromise";
import { cocaMap } from "./coca.js";

function getCocaRank(word) {
  if (cocaMap.has(word)) {
    return cocaMap.get(word).index + 1;
  }
  return 0;
}
export async function processEpub(filePath, level = 5000) {
  const epubObj = await parseEpub(filePath, {
    type: "path",
  });

  const stemedMap = new Map();
  let rankCount;
  for (const section of epubObj.sections) {
    const mdcontent = section
      .toMarkdown()
      .replace(/[()#\[*]/g, "")
      .replace(/\]/g, ".");
    const allSentencesExtend = nlp(mdcontent).compute("root").json();

    for (const sentence of allSentencesExtend) {
      rankCount = sentence.terms.reduce(
        (sum, term) => sum + getCocaRank(term.root || term.normal),
        0
      );
      for (const term of sentence.terms) {
        let stemed = term.root || term.normal;
        let rank = getCocaRank(stemed);
        if (stemed.length > 2 && rank > level) {
          if (!stemedMap.has(stemed)) {
            stemedMap.set(stemed, {
              stemed,
              tokens: new Set(),
              examples: new Map(),
              count: 0,
              rank,
            });
          }
          const obj = stemedMap.get(stemed);
          obj.tokens.add(term.text);
          obj.count++;
          if (sentence.terms.length > 5) {
            obj.examples.set(sentence.text, rankCount);
          }
        }
      }
    }
  }

  const objectArray = Array.from(stemedMap.values(), (obj) => {
    obj.tokens = [...obj.tokens];
    obj.examples = Array.from(obj.examples, ([example, rankCount]) => ({
      example,
      rankCount,
    })).sort((a, b) => a.rankCount - b.rankCount);
    return obj;
  }).sort((a, b) => a.count - b.count);
  return objectArray;
}
