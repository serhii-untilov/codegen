/**
 * Write / patch files
 */

import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { TemplateMeta } from '../engine/template-reader.js';

export class Writer {
    constructor(private readonly folderPath: string) {}

    async write(fileName: string, meta: TemplateMeta, content: string): Promise<void> {
        const isExists = await fileExists(this.folderPath, fileName);
        if (isExists && !meta.inject?.overwrite) {
            console.log(chalk.yellow(`Skipping existing file: ${fileName}`));
        } else if (!isExists && meta.inject?.mode === 'create') {
            const fullPath = await writeFile(this.folderPath, fileName, content);
            console.log(chalk.green(`Generated: ${fullPath}`));
        }
    }
}

export async function filePath(folderPath: string, fileName: string): Promise<string> {
    return path.join(folderPath, fileName);
}

export async function writeFile(folderPath: string, fileName: string, content: string): Promise<string> {
    const fullPath = path.join(folderPath, fileName);

    await fs.promises.mkdir(folderPath, { recursive: true });
    await fs.promises.writeFile(fullPath, content);

    return fullPath;
}

export async function fileExists(folderPath: string, fileName: string): Promise<boolean> {
    const fullPath = path.join(folderPath, fileName);
    return await fs.pathExists(fullPath);
}
