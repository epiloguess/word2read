import { parseEpub } from "@gxl/epub-parser";
import nlp from "compromise";
import { cocaMap } from "./coca.js";

function getCocaRank(word) {
  return cocaMap.has(word) ? cocaMap.get(word).index + 1 : 0;
}

function contentRegex(content) {
  return content.replace(/[()#\[*]/g, "").replace(/\]/g, ".");
}

function processSentence(sentence, stemedMap, level) {
  let rankCount = sentence.terms.reduce(
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

function stemedMapToObjArray(stemedMap) {
  let objectArray = Array.from(stemedMap.values(), (obj) => {
    obj.tokens = [...obj.tokens];
    obj.examples = Array.from(obj.examples, ([example, rankCount]) => ({
      example,
      rankCount,
    })).sort((a, b) => a.rankCount - b.rankCount);
    return obj;
  }).sort((a, b) => a.count - b.count);
  return objectArray;
}
export async function processEpub(filePath, level = 5000) {
  const epubObj = await parseEpub(filePath, {
    type: "path",
  });

  const stemedMap = new Map();
  for (const section of epubObj.sections) {
    const content = contentRegex(section.toMarkdown());
    const allSentencesExtend = nlp(content).compute("root").json();
    for (const sentence of allSentencesExtend) {
      processSentence(sentence, stemedMap, level);
    }
  }
  return stemedMapToObjArray(stemedMap);
}
