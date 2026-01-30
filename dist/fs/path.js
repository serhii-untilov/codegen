/**
 * Path helpers
 */
import path from 'path';
export function getFilePath(folderPath, filePath) {
    return path.join(folderPath, filePath);
}
export function getRelativePath(base, full) {
    return path.relative(base, full);
}
export function getApplicationPath() {
    return process.cwd();
}
