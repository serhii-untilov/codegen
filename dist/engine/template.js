import Handlebars from 'handlebars';
import { Transform } from '../types/transform.js';
const helpers = new Set(['if', 'each', 'unless', 'with', 'log', ...Object.values(Transform)]);
export function extractTemplateVars(source) {
    const ast = Handlebars.parse(source);
    const vars = new Set();
    function walk(node) {
        if (!node)
            return;
        if (node.type === 'MustacheStatement' || node.type === 'BlockStatement') {
            const name = node.path?.original;
            if (name && !helpers.has(name) && !name.startsWith('@') && !name.startsWith('codegen.')) {
                vars.add(name.split('.')[0]);
            }
        }
        for (const value of Object.values(node)) {
            if (Array.isArray(value))
                value.forEach(walk);
            else if (typeof value === 'object')
                walk(value);
        }
    }
    walk(ast);
    return [...vars];
}
