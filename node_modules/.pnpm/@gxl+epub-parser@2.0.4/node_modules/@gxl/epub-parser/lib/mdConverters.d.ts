export declare const resolveInlineNavHref: (href: string) => string;
export declare const h: {
    filter: string[];
    replacement: (innerHTML: string, node: HTMLElement) => string;
};
export declare const span: {
    filter: string[];
    replacement: (innerHTML: string) => string;
};
export declare const a: {
    filter: string[];
    replacement: (innerHTML: string, node: HTMLEmbedElement) => string;
};
export declare const div: {
    filter: string[];
    replacement: (innerHTML: string) => string;
};
export declare const img: {
    filter: string[];
    replacement: (innerHTML: string) => string;
};
