import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import * as transform from '../helpers/transforms.js';
import { Transform } from '../types/transform.js';
export async function writeFile(filePath, content) {
    fs.promises.mkdir(path.dirname(filePath), { recursive: true }).then(() => fs.promises.writeFile(filePath, content));
    console.log(chalk.green(`Generated: ${filePath}`));
}
export async function makeOutputFolder(outputRoot, templatePath, file, artifactName) {
    const templateFile = path.join(templatePath, file);
    const relativePath = path.relative(templatePath, path.dirname(templateFile));
    const outputPath = makeOutputFileName(relativePath, artifactName);
    const outputFolder = path.resolve(outputRoot, outputPath);
    await fs.ensureDir(outputFolder);
    return outputFolder;
}
export function makeOutputFilePath(folder, file, artifactName) {
    const fileName = makeOutputFileName(path.basename(file), artifactName);
    return path.resolve(folder, fileName);
}
export function makeOutputFileName(file, artifactName) {
    // TODO: consider using a more robust templating solution
    return file
        .replace('.hbs', '')
        .replace(`name.${Transform.LOWERCASE}`, transform.lowercase(artifactName))
        .replace(`name.${Transform.UPPERCASE}`, transform.uppercase(artifactName))
        .replace(`name.${Transform.CAPITALIZE}`, transform.capitalize(artifactName))
        .replace(`name.${Transform.CAMEL_CASE}`, transform.camelCase(artifactName))
        .replace(`name.${Transform.PASCAL_CASE}`, transform.pascalCase(artifactName))
        .replace(`name.${Transform.SNAKE_CASE}`, transform.snakeCase(artifactName))
        .replace(`name.${Transform.KEBAB_CASE}`, transform.kebabCase(artifactName))
        .replace('name', artifactName);
}
