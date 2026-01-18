import Handlebars from 'handlebars';
import { Helpers } from '../types/transform.js';

export function extractTemplateVars(source: string): string[] {
    const ast = Handlebars.parse(source);
    const vars = new Set<string>();

    function walk(node: any) {
        if (!node) return;

        if (node.type === 'MustacheStatement' || node.type === 'BlockStatement') {
            const name = node.path?.original;
            if (name && !Helpers.has(name) && !name.startsWith('@') && !name.startsWith('codegen.')) {
                vars.add(name.split('.')[0]);
            }
        }

        for (const value of Object.values(node)) {
            if (Array.isArray(value)) value.forEach(walk);
            else if (typeof value === 'object') walk(value);
        }
    }

    walk(ast);
    return [...vars];
}
