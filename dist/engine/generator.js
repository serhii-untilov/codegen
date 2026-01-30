/**
 * Main generation pipeline
 */
import Handlebars from 'handlebars';
import { getApplicationPath, getFilePath, getRelativePath } from '../fs/path.js';
import { getTemplateFile } from '../fs/reader.js';
import { nowDateTime } from '../helpers/date.js';
import { getCodegenMeta } from '../helpers/meta.js';
import { Context } from './context.js';
import { readTemplate } from './template-reader.js';
export class Generator {
    constructor(options, templatePath, file) {
        this.options = options;
        this.templatePath = templatePath;
        this.file = file;
    }
    async run() {
        const { meta, content } = await readTemplate(getTemplateFile(this.templatePath, this.file));
        const targetFileName = this.makeTargetFileName(this.file, this.options.name, meta);
        const context = new Context({
            ...meta,
            codegen: getCodegenMeta(),
            ...nowDateTime(),
            template: getRelativePath(getApplicationPath(), getFilePath(this.templatePath, this.file)),
            name: this.options.name,
            target: targetFileName,
        });
        await context.resolveUndefinedVars(content, this.file);
        const render = Handlebars.compile(content);
        const rendered = render(context.getAllVars());
        return { fileName: targetFileName, meta, content: rendered };
    }
    makeTargetFileName(file, name, meta) {
        return meta.target ? Handlebars.compile(meta.target)({ name }) : file.replace(/\.hbs$/, '');
    }
}
