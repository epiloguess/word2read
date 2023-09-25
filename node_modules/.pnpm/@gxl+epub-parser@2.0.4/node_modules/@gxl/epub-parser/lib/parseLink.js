"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
function parseHref(href) {
    var hash = href.split('#')[1];
    var url = href.split('#')[0];
    var prefix = url.split('/').slice(0, -1).join('/');
    var filename = lodash_1.default.last(url.split('/'));
    var name = filename.split('.').slice(0, -1).join('.');
    var ext = lodash_1.default.last(filename.split('.'));
    if (filename.indexOf('.') === -1) {
        ext = '';
    }
    return { hash: hash, name: name, ext: ext, prefix: prefix, url: url };
}
exports.default = parseHref;
//# sourceMappingURL=parseLink.js.map