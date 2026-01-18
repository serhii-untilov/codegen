// Read templates/files from filesystem
import fs from 'fs-extra';
import path from 'path';
export function getTemplatePath(templateFolder) {
    const resolvedPath = path.resolve(templateFolder);
    if (!fs.existsSync(resolvedPath) || !fs.lstatSync(resolvedPath).isDirectory()) {
        throw new Error(`Template folder not found: ${resolvedPath}`);
    }
    return resolvedPath;
}
export function getTemplateFile(templateFolder, relativeTemplatePath) {
    const templateFile = path.resolve(templateFolder, relativeTemplatePath);
    if (!fs.existsSync(templateFile)) {
        throw new Error(`Template file not found: ${templateFile}`);
    }
    return templateFile;
}
export async function getTemplateContent(templateFile) {
    const templateContent = await fs.readFile(templateFile, 'utf-8');
    return templateContent;
}
export function getTemplateName(templatePath, templateFile) {
    return path.join(templatePath, templateFile);
}
