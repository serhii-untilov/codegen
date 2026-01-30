/**
 * meta data helpers
 */
import pkg from '../../package.json' with { type: 'json' };
import { pascalCase } from './transforms.js';
export function getCodegenMeta() {
    return { ...pkg, name: pascalCase(pkg.name) };
}
