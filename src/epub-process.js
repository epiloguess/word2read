var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { parseEpub } from "@gxl/epub-parser";
import nlp from "compromise";
import { cocaMap } from "./coca.js";
function getCocaRank(word) {
    return cocaMap.has(word) ? cocaMap.get(word).index + 1 : 0;
}
function contentRegex(content) {
    return (content
        // .replace(/[\u4e00-\u9fa5]/g, "")
        // .replace(/\d+\./g, "")
        // .replace(/[\r\n]+/g, "")
        // .replace(/\./g, ". \r\n")
        // .replace(/\[[^\]]+\]/g, "")
        // .replace(/[•_()#*]/g, "")
        // .replace(/\.{3}/g, "")
        // .replace(/\[\w+\]/g, "")
        // .replace(/\d+\./g, "")
        // .replace(/\]/g, ".");
        .replace(/<[^>]+>/g, ""));
}
function processSentence(sentence, stemedMap, level) {
    let rankCount = sentence.terms.reduce((sum, term) => sum + getCocaRank(term.root || term.normal), 0);
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
            // if (sentence.terms.length > 3) {
            obj.examples.set(sentence.text, rankCount);
            // }
        }
    }
}
function stemedMapToObjArray(stemedMap) {
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
    return objectArray;
}
export function processEpub(filePath, level = 4000) {
    return __awaiter(this, void 0, void 0, function* () {
        const epubObj = yield parseEpub(filePath, {
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
    });
}
