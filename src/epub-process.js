import { parseEpub } from "@gxl/epub-parser";
import nlp from "compromise";
import { coca, stopwords } from "./coca.js";

export async function processEpub(filePath) {
  const epubObj = await parseEpub(filePath, {
    type: "path",
  });

  const stemedTokensMap = new Map();

  for (const section of epubObj.sections) {
    const mdcontent = section.toMarkdown();
    const allSentencesExtend = nlp(mdcontent).compute("root").json();

    for (const sentence of allSentencesExtend) {
      for (const term of sentence.terms) {
        const stemed = term.root || term.normal;
        if (stemed.length > 2 && coca.has(stemed) && !stopwords.has(stemed)) {
          if (!stemedTokensMap.has(stemed)) {
            stemedTokensMap.set(stemed, {
              stemedToken: stemed,
              tokens: new Set(),
              examples: new Set(),
              count: 0,
            });
          }
          const obj = stemedTokensMap.get(stemed);
          obj.examples.add(sentence.text);
          obj.tokens.add(term.text);
          obj.count++;
        }
      }
    }
  }

  const objectArray = Array.from(stemedTokensMap.values(), (obj) => {
    obj.tokens = [...obj.tokens];
    obj.examples = [...obj.examples].sort((a, b) => a.length - b.length);
    return obj;
  }).sort((a, b) => a.count - b.count);

  return objectArray;
}
