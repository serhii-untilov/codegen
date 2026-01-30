/**
 * Main generation pipeline
 */
import Handlebars from 'handlebars';
import { getApplicationPath, getFilePath, getRelativePath } from '../fs/path.js';
import { getTemplateFile } from '../fs/reader.js';
import { readTemplate } from './template-reader.js';
export class Generator {
    constructor(options, context, templatePath, file) {
        this.options = options;
        this.context = context;
        this.templatePath = templatePath;
        this.file = file;
    }
    async run() {
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
    makeTargetFileName(file, name, meta) {
        return meta.target ? Handlebars.compile(meta.target)({ name }) : file.replace(/\.hbs$/, '');
    }
}
