import pkg from '../../package.json' with { type: 'json' };
import { nowDateTime } from './date.js';
import { pascalCase } from './transform.js';
export function getCodegenMeta(extraMetaData = {}) {
    return { codegen: { ...pkg, ...nowDateTime(), name: pascalCase(pkg.name), ...extraMetaData } };
}
