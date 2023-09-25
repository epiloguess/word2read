"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsdom_1 = require("jsdom");
var lodash_1 = __importDefault(require("lodash"));
var utils_1 = require("./utils");
var OMITTED_TAGS = ['head', 'input', 'textarea', 'script', 'style', 'svg'];
var UNWRAP_TAGS = ['body', 'html', 'div', 'span'];
var PICKED_ATTRS = ['href', 'src', 'id'];
/**
 * recursivelyReadParent
 * @param node
 * @param callback invoke every time a parent node is read, return truthy value to stop the reading process
 * @param final callback when reaching the root
 */
var recursivelyReadParent = function (node, callback, final) {
    var _read = function (_node) {
        var parent = _node.parentNode;
        if (parent) {
            var newNode = callback(parent);
            if (!newNode) {
                return _read(parent);
            }
            return newNode;
        }
        else {
            if (final) {
                return final();
            }
            return node;
        }
    };
    return _read(node);
};
var parseHTML = function (HTMLString, config) {
    if (config === void 0) { config = {}; }
    var rootNode = new jsdom_1.JSDOM(HTMLString).window.document.documentElement;
    var resolveHref = config.resolveHref, resolveSrc = config.resolveSrc;
    // initial parse
    return utils_1.traverseNestedObject(rootNode, {
        childrenKey: 'childNodes',
        preFilter: function (node) {
            return node.nodeType === 1 || node.nodeType === 3;
        },
        transformer: function (node, children) {
            if (node.nodeType === 1) {
                var tag = node.tagName.toLowerCase();
                var attrs_1 = {};
                if (OMITTED_TAGS.indexOf(tag) !== -1) {
                    return null;
                }
                if (UNWRAP_TAGS.indexOf(tag) !== -1 && children) {
                    return children.length === 1 ? children[0] : children;
                }
                PICKED_ATTRS.forEach(function (attr) {
                    var attrVal = node.getAttribute(attr) || undefined;
                    if (attrVal && attr === 'href' && resolveHref) {
                        attrVal = resolveHref(attrVal);
                    }
                    if (attrVal && attr === 'src' && resolveSrc) {
                        attrVal = resolveSrc(attrVal);
                    }
                    attrs_1[attr] = attrVal;
                });
                return { tag: tag, type: 1, children: children, attrs: attrs_1 };
            }
            else {
                var text_1 = node.textContent.trim();
                if (!text_1) {
                    return null;
                }
                var makeTextObject_1 = function () {
                    return {
                        type: 3,
                        text: text_1,
                    };
                };
                // find the closest parent which is not in UNWRAP_TAGS
                // if failed then wrap with p tag
                return recursivelyReadParent(node, function (parent) {
                    var tag = parent.tagName && parent.tagName.toLowerCase();
                    if (!tag || UNWRAP_TAGS.indexOf(tag) !== -1) {
                        return null;
                    }
                    return makeTextObject_1();
                }, function () {
                    return {
                        tag: 'p',
                        children: [makeTextObject_1()],
                    };
                });
            }
        },
        postFilter: function (node) {
            return !lodash_1.default.isEmpty(node);
        },
    });
};
exports.default = parseHTML;
//# sourceMappingURL=parseHTML.js.map