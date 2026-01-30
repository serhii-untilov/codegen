/**
 * Path helpers
 */

import path from 'path';

export function getFilePath(folderPath: string, filePath: string): string {
    return path.join(folderPath, filePath);
}

export function getRelativePath(base: string, full: string): string {
    return path.relative(base, full);
}

export function getApplicationPath(): string {
    return process.cwd();
}
