/**
 * Write / patch files
 */
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
export class Writer {
    constructor(folderPath, fileName, meta) {
        this.folderPath = folderPath;
        this.fileName = fileName;
        this.meta = meta;
    }
    async write(content) {
        const isExists = await fileExists(this.folderPath, this.fileName);
        if (isExists && !this.meta.inject?.overwrite) {
            console.log(chalk.yellow(`Skipping existing file: ${this.fileName}`));
        }
        else if (!isExists && this.meta.inject?.mode === 'create') {
            const fullPath = await writeFile(this.folderPath, this.fileName, content);
            console.log(chalk.green(`Generated: ${fullPath}`));
        }
    }
}
export async function filePath(folderPath, fileName) {
    return path.join(folderPath, fileName);
}
export async function writeFile(folderPath, fileName, content) {
    const fullPath = path.join(folderPath, fileName);
    await fs.promises.mkdir(folderPath, { recursive: true });
    await fs.promises.writeFile(fullPath, content);
    return fullPath;
}
export async function fileExists(folderPath, fileName) {
    const fullPath = path.join(folderPath, fileName);
    return await fs.pathExists(fullPath);
}
