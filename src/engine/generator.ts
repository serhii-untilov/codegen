/**
 * Main generation pipeline
 */

import Handlebars from 'handlebars';
import { Options } from '../cli/options.js';
import { getApplicationPath, getFilePath, getRelativePath } from '../fs/path.js';
import { getTemplateFile } from '../fs/reader.js';
import { Context } from './context.js';
import { readTemplate, TemplateMeta } from './template-reader.js';

export type GeneratedFile = {
    fileName: string;
    meta: TemplateMeta;
    content: string;
};

export class Generator {
    constructor(
        private readonly options: Options,
        private readonly context: Context,
        private readonly templatePath: string,
        private readonly file: string,
    ) {}

    async run(): Promise<GeneratedFile> {
        const { meta, content } = await readTemplate(getTemplateFile(this.templatePath, this.file));
        const targetFileName = this.makeTargetFileName(this.file, this.options.name, meta);
        this.context.addVars({
            ...meta,
            template: getRelativePath(getApplicationPath(), getFilePath(this.templatePath, this.file)),
            name: this.options.name,
            target: targetFileName,
        });
        await this.context.resolveUndefinedVars(content, this.file);
        const render = Handlebars.compile(content);
        const rendered = render(this.context.getAllVars());
        return { fileName: targetFileName, meta, content: rendered };
    }

    makeTargetFileName(file: string, name: string, meta: TemplateMeta): string {
        return meta.target ? Handlebars.compile(meta.target)({ name }) : file.replace(/\.hbs$/, '');
    }
}
