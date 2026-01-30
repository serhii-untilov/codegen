/**
 * Handlebars rendering
 */
export type TemplateMeta = {
    name?: string;
    description?: string;
    target?: string;
    inject?: {
        mode: 'create' | 'append' | 'replace';
        overwrite?: boolean;
        regex?: string;
    };
    vars?: string[];
};
export type ParsedTemplate = {
    meta: TemplateMeta;
    content: string;
};
export declare function readTemplate(filePath: string): Promise<ParsedTemplate>;
export declare function extractTemplateVars(source: string): string[];
