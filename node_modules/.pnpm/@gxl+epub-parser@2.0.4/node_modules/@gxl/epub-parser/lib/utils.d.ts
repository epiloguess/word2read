import { GeneralObject } from './types';
export interface TraverseNestedObject {
    preFilter?: (node: GeneralObject) => boolean;
    postFilter?: (node: GeneralObject) => boolean;
    transformer?: (node: GeneralObject, children?: GeneralObject[]) => any;
    finalTransformer?: (node: GeneralObject) => any;
    childrenKey: string;
}
/**
 * traverseNestedObject
 * a note about config.transformer
 * `children` is a recursively transformed object and should be returned for transformer to take effect
 * objects without `children` will be transformed by finalTransformer
 * @param _rootObject
 * @param config
 */
export declare const traverseNestedObject: (_rootObject: Object | Object[], config: TraverseNestedObject) => any[];
