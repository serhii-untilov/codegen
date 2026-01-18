import pkg from '../../package.json' with { type: 'json' };
import { nowDateTime } from './date.js';
import { pascalCase } from './transforms.js';
export function getCodegenMeta() {
    return { codegen: { ...pkg, ...nowDateTime(), name: pascalCase(pkg.name) } };
}
