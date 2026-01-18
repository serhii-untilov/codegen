import pkg from '../../package.json' with { type: 'json' };
import type { CodegenMeta } from '../types/meta.js';
import { nowDateTime } from './date.js';
import { pascalCase } from './transforms.js';

export function getCodegenMeta(): CodegenMeta {
    return { codegen: { ...pkg, ...nowDateTime(), name: pascalCase(pkg.name) } };
}
