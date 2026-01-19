/**
 * Path helpers
 */
import path from 'path';
export function getTemplateName(templatePath, templateFile) {
    return path.join(templatePath, templateFile);
}
