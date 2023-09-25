export default function parseHref(href: string): {
    hash: string;
    name: string;
    ext: string | undefined;
    prefix: string;
    url: string;
};
