import { parseEpub } from "@gxl/epub-parser";
import nlp from "compromise";
import { coca, stopwords } from "./coca.js";

export async function processEpub(filePath) {
  const epubObj = await parseEpub(filePath, {
    type: "path",
  });

  const stemed_tokens = new Map();

  epubObj.sections.map((section) => {
    const mdcontent = section.toMarkdown();
    const allsentences_extend = nlp(mdcontent).compute("root").json();

    allsentences_extend.forEach((sentence) => {
      sentence.terms
        .filter((term) => {
          let stemed = term.root || term.normal;
          return (
            stemed.length > 2 && coca.has(stemed) && !stopwords.has(stemed)
          );
        })
        .forEach((term) => {
          let stemed = term.root || term.normal;
          if (!stemed_tokens.has(stemed)) {
            stemed_tokens.set(stemed, {
              stemed_token: stemed,
              tokens: new Set(),
              examples: new Set(),
              count: 0,
            });
          }
          const obj = stemed_tokens.get(stemed);
          obj.examples.add(sentence.text);
          obj.tokens.add(term.text);
          obj.count++;
        });
    });
  });

  const objectArray = Array.from(stemed_tokens.values(), (obj) => {
    obj.tokens = [...obj.tokens];
    obj.examples = [...obj.examples].sort((a, b) => a.length - b.length);
    return obj;
  }).sort((a, b) => a.count - b.count);

  // return objectArray;
  return objectArray.length;
}
