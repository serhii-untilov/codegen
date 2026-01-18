// Read templates/files from filesystem
import fs from 'fs-extra';
import path from 'path';

export function getTemplateFolder(templateFolder: string): string {
    const resolvedPath = path.resolve(templateFolder);
    if (!fs.existsSync(resolvedPath) || !fs.lstatSync(resolvedPath).isDirectory()) {
        throw new Error(`Template folder not found: ${resolvedPath}`);
    }
    return resolvedPath;
}

export function getTemplateFile(templateFolder: string, relativeTemplatePath: string): string {
    const templateFile = path.resolve(templateFolder, relativeTemplatePath);
    if (!fs.existsSync(templateFile)) {
        throw new Error(`Template file not found: ${templateFile}`);
    }
    return templateFile;
}

export async function getTemplateContent(templateFile: string) {
    const templateContent = await fs.readFile(templateFile, 'utf-8');
    return templateContent;
}
