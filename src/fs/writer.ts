/**
 * Write / patch files
 */

import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import * as transforms from '../helpers/transforms.js';
import { Transforms } from '../constants/transforms.js';

// export async function writeFile(filePath: string, content: string): Promise<void> {
//     fs.promises.mkdir(path.dirname(filePath), { recursive: true }).then(() => fs.promises.writeFile(filePath, content));
//     console.log(chalk.green(`Generated: ${filePath}`));
// }

export async function writeFile(folderPath: string, fileName: string, content: string): Promise<void> {
    const fullPath = path.join(folderPath, fileName);

    await fs.promises.mkdir(folderPath, { recursive: true });
    await fs.promises.writeFile(fullPath, content);

    console.log(chalk.green(`Generated: ${fullPath}`));
}

export async function makeOutputFolder(
    outputRoot: string,
    templatePath: string,
    file: string,
    artifactName: string,
): Promise<string> {
    const templateFile = path.join(templatePath, file);
    const relativePath = path.relative(templatePath, path.dirname(templateFile));
    const outputPath = makeOutputFileName(relativePath, artifactName);
    const outputFolder = path.resolve(outputRoot, outputPath);
    await fs.ensureDir(outputFolder);
    return outputFolder;
}

export function makeOutputFilePath(folder: string, file: string, artifactName: string): string {
    const fileName = makeOutputFileName(path.basename(file), artifactName);
    return path.resolve(folder, fileName);
}

export function makeOutputFileName(file: string, artifactName: string): string {
    // TODO: consider using a more robust templating solution
    return file
        .replace('.hbs', '')
        .replace(`name.${Transforms.LOWERCASE}`, transforms.lowercase(artifactName))
        .replace(`name.${Transforms.UPPERCASE}`, transforms.uppercase(artifactName))
        .replace(`name.${Transforms.CAPITALIZE}`, transforms.capitalize(artifactName))
        .replace(`name.${Transforms.CAMEL_CASE}`, transforms.camelCase(artifactName))
        .replace(`name.${Transforms.PASCAL_CASE}`, transforms.pascalCase(artifactName))
        .replace(`name.${Transforms.SNAKE_CASE}`, transforms.snakeCase(artifactName))
        .replace(`name.${Transforms.KEBAB_CASE}`, transforms.kebabCase(artifactName))
        .replace('name', artifactName);
}
