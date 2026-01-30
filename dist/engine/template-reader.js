/**
 * Handlebars rendering
 */
import fs from 'fs-extra';
import matter from 'gray-matter';
import Handlebars from 'handlebars';
import { Helpers } from '../constants/transforms.js';
export async function readTemplate(filePath) {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = matter(raw);
    return {
        meta: parsed.data,
        content: parsed.content.trim(),
    };
}
export function extractTemplateVars(source) {
    const ast = Handlebars.parse(source);
    const vars = new Set();
    function walk(node) {
        if (!node)
            return;
        if (node.type === 'MustacheStatement' || node.type === 'BlockStatement') {
            const name = node.path?.original;
            if (name && !Helpers.has(name) && !name.startsWith('@') && !name.startsWith('codegen.')) {
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
