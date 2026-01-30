/**
 * meta data helpers
 */

import pkg from '../../package.json' with { type: 'json' };
import type { CodegenMeta } from '../types/codegen-meta.js';
import { pascalCase } from './transforms.js';

export function getCodegenMeta(): CodegenMeta {
    return { ...pkg, name: pascalCase(pkg.name) };
}
