/**
 * Path helpers
 */

import path from 'path';

export function getTemplateName(templatePath: string, templateFile: string): string {
    return path.join(templatePath, templateFile);
}
