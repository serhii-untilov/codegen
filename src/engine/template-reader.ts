/**
 * Handlebars rendering
 */

import fs from 'fs-extra';
import matter from 'gray-matter';
import Handlebars from 'handlebars';
import { Helpers } from '../constants/transforms.js';

export type TemplateMeta = {
    name?: string;
    description?: string;
    target?: string;
    inject?: {
        mode: 'create' | 'append' | 'replace';
        overwrite?: boolean;
        regex?: string;
    };
    vars?: string[];
};

export type ParsedTemplate = {
    meta: TemplateMeta;
    content: string;
};

export async function readTemplate(filePath: string): Promise<ParsedTemplate> {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = matter(raw);

    return {
        meta: parsed.data as TemplateMeta,
        content: parsed.content.trim(),
    };
}

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
