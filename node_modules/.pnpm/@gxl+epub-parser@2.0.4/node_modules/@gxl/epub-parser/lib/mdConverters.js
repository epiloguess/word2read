"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.img = exports.div = exports.a = exports.span = exports.h = exports.resolveInlineNavHref = void 0;
var parseLink_1 = __importDefault(require("./parseLink"));
exports.resolveInlineNavHref = function (href) {
    if (href && href.indexOf('http://') === -1) {
        var parsed = parseLink_1.default(href);
        if (parsed.hash) {
            return "#" + parsed.name + "$" + parsed.hash;
        }
        return "#" + parsed.name;
    }
    return href;
};
exports.h = {
    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    replacement: function (innerHTML, node) {
        var hLevel = node.tagName.charAt(1);
        var hPrefix = '';
        for (var i = 0; i < hLevel; i++) {
            hPrefix += '#';
        }
        // return `\n${hPrefix} ${innerHTML.trim()}\n\n`
        var hTag = node.tagName.toLowerCase();
        var id = node.getAttribute('id');
        if (!id) {
            return "\n" + hPrefix + " " + innerHTML + "\n\n";
        }
        // 块级元素若保留原标签需添加换行符，否则临近元素渲染会出现问题
        return "\n<" + hTag + " id=\"" + id + "\">" + innerHTML.trim().split('\n').join(' ') + "</" + hTag + ">\n\n";
    },
};
exports.span = {
    filter: ['span'],
    replacement: function (innerHTML) {
        return innerHTML;
    },
};
exports.a = {
    filter: ['a'],
    replacement: function (innerHTML, node) {
        var href = node.getAttribute('href');
        return "\n[" + innerHTML + "](" + exports.resolveInlineNavHref(href) + ")\n\n";
    },
};
exports.div = {
    filter: ['div'],
    replacement: function (innerHTML) {
        return "\n" + innerHTML + "\n\n";
    },
};
exports.img = {
    filter: ['img'],
    replacement: function (innerHTML) {
        return "\n[PIC]\n\n";
    },
};
//# sourceMappingURL=mdConverters.js.map