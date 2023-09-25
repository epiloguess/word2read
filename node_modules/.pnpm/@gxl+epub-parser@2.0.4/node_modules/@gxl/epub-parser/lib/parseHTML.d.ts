import { HtmlNodeObject } from './types';
export interface ParseHTMLConfig {
    resolveSrc?: (src: string) => string;
    resolveHref?: (href: string) => string;
}
declare const parseHTML: (HTMLString: string, config?: ParseHTMLConfig) => HtmlNodeObject[];
export default parseHTML;
