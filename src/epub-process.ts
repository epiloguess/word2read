import { parseEpub } from "@gxl/epub-parser";
import nlp from "compromise";
import { cocaMap } from "./coca.js";

function getCocaRank(word: string) {
  return cocaMap.has(word) ? cocaMap.get(word).index + 1 : 0;
}

function contentRegex(content) {
  return content.replace(/[()#\[*]/g, "").replace(/\]/g, ".");
}

function processSentence(sentence, stemedMap, level) {
  let rankCount = sentence.terms.reduce(
    (sum: number, term) => sum + getCocaRank(term.root || term.normal),
    0
  );
  for (const term of sentence.terms) {
    let stemed = term.root || term.normal;
    let rank = getCocaRank(stemed);

    if (rank > 0) {
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

let wordsCount: number;

interface stemedMapValue {
  stemed: string;
  tokens: Set<string> | string[];
  examples: Map<string, number> | { example: string; rankCount: number }[];
  count: number;
  rank: number;
}

function stemedMapToObjArray(stemedMap: Map<string, stemedMapValue>) {
  let objectArray = Array.from(stemedMap.values(), (obj) => {
    obj.tokens = [...obj.tokens];
    if (obj.examples instanceof Map) {
      obj.examples = Array.from(obj.examples, ([example, rankCount]) => ({
        example,
        rankCount,
      })).sort((a, b) => a.rankCount - b.rankCount);
    }
    return obj;
  }).sort((a, b) => a.rank - b.rank);
  wordsCount = objectArray.reduce((sum, term) => sum + term.count, 0);
  return objectArray;
}

export async function processEpub(filePath: string, level = 4000) {
  const epubObj = await parseEpub(filePath, {
    type: "path",
  });

  const stemedMap: Map<string, stemedMapValue> = new Map();
  for (const section of epubObj.sections) {
    const content: string = contentRegex(section.toMarkdown());
    const allSentencesExtend = nlp(content).compute("root").json();
    for (const sentence of allSentencesExtend) {
      processSentence(sentence, stemedMap, level);
    }
  }
  console.log(wordsCount);
  return stemedMapToObjArray(stemedMap);
}
