"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Section = void 0;
var path_1 = __importDefault(require("path"));
// @ts-ignore
var to_markdown_1 = __importDefault(require("to-markdown"));
var parseLink_1 = __importDefault(require("./parseLink"));
var parseHTML_1 = __importDefault(require("./parseHTML"));
var mdConverters = __importStar(require("./mdConverters"));
var isInternalUri = function (uri) {
    return uri.indexOf('http://') === -1 && uri.indexOf('https://') === -1;
};
var Section = /** @class */ (function () {
    function Section(_a) {
        var id = _a.id, htmlString = _a.htmlString, resourceResolver = _a.resourceResolver, idResolver = _a.idResolver, expand = _a.expand;
        var _b;
        this.id = id;
        this.htmlString = htmlString;
        this._resourceResolver = resourceResolver;
        this._idResolver = idResolver;
        if (expand) {
            this.htmlObjects = (_b = this.toHtmlObjects) === null || _b === void 0 ? void 0 : _b.call(this);
        }
    }
    Section.prototype.toMarkdown = function () {
        return to_markdown_1.default(this.htmlString, {
            converters: [
                mdConverters.h,
                mdConverters.span,
                mdConverters.div,
                mdConverters.img,
                mdConverters.a,
            ],
        });
    };
    Section.prototype.toHtmlObjects = function () {
        var _this = this;
        return parseHTML_1.default(this.htmlString, {
            resolveHref: function (href) {
                var _a;
                if (isInternalUri(href)) {
                    var hash = parseLink_1.default(href).hash;
                    // todo: what if a link only contains hash part?
                    var sectionId = (_a = _this._idResolver) === null || _a === void 0 ? void 0 : _a.call(_this, href);
                    if (hash) {
                        return "#" + sectionId + "," + hash;
                    }
                    return "#" + sectionId;
                }
                return href;
            },
            resolveSrc: function (src) {
                var _a, _b;
                if (isInternalUri(src)) {
                    // todo: may have bugs
                    var absolutePath = path_1.default.resolve('/', src).substr(1);
                    var buffer = (_b = (_a = _this._resourceResolver) === null || _a === void 0 ? void 0 : _a.call(_this, absolutePath)) === null || _b === void 0 ? void 0 : _b.asNodeBuffer();
                    var base64 = buffer.toString('base64');
                    return "data:image/png;base64," + base64;
                }
                return src;
            },
        });
    };
    return Section;
}());
exports.Section = Section;
var parseSection = function (config) {
    return new Section(config);
};
exports.default = parseSection;
//# sourceMappingURL=parseSection.js.map