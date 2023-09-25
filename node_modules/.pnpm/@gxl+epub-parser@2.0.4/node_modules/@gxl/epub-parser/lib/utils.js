"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.traverseNestedObject = void 0;
var lodash_1 = __importDefault(require("lodash"));
/**
 * traverseNestedObject
 * a note about config.transformer
 * `children` is a recursively transformed object and should be returned for transformer to take effect
 * objects without `children` will be transformed by finalTransformer
 * @param _rootObject
 * @param config
 */
exports.traverseNestedObject = function (_rootObject, config) {
    var childrenKey = config.childrenKey, transformer = config.transformer, preFilter = config.preFilter, postFilter = config.postFilter, finalTransformer = config.finalTransformer;
    if (!_rootObject) {
        return [];
    }
    var traverse = function (rootObject) {
        var makeArray = function () {
            if (Array.isArray(rootObject) ||
                lodash_1.default.isArrayLikeObject(rootObject) ||
                lodash_1.default.isArrayLike(rootObject)) {
                return rootObject;
            }
            return [rootObject];
        };
        var rootArray = makeArray();
        var result = rootArray;
        if (preFilter) {
            result = lodash_1.default.filter(result, preFilter);
        }
        result = lodash_1.default.map(result, function (object, index) {
            var _a;
            if (object[childrenKey]) {
                var transformedChildren = traverse(object[childrenKey]);
                // in parseHTML, if a tag is in unwrap list, like <span>aaa<span>bbb</span></span>
                // the result needs to be flatten
                var children = lodash_1.default.isEmpty(transformedChildren)
                    ? undefined
                    : lodash_1.default.flattenDeep(transformedChildren);
                if (transformer) {
                    return transformer(object, children);
                }
                return __assign(__assign({}, object), (_a = {},
                    _a[childrenKey] = children,
                    _a));
            }
            if (finalTransformer) {
                return finalTransformer(object);
            }
            return object;
        });
        if (postFilter) {
            result = lodash_1.default.filter(result, postFilter);
        }
        return result;
    };
    return lodash_1.default.flattenDeep(traverse(_rootObject));
};
//# sourceMappingURL=utils.js.map