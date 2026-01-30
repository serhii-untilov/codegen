/**
 * Main generation pipeline
 */

import chalk from 'chalk';
import { glob } from 'glob';
import Handlebars from 'handlebars';
import { Options } from '../cli/options.js';
import { getApplicationPath, getFilePath, getRelativePath } from '../fs/path.js';
import { getTemplateFile, getTemplatePath } from '../fs/reader.js';
import { writeFile } from '../fs/writer.js';
import { nowDateTime } from '../helpers/date.js';
import { getCodegenMeta } from '../helpers/meta.js';
import { startSpinner, succeedSpinner } from '../helpers/spinner.js';
import { Context } from './context.js';
import { readTemplate, TemplateMeta } from './template-reader.js';

export class Generator {
    constructor(private readonly options: Options) {}

    async run() {
        startSpinner('Generating...');
        const templatePath = getTemplatePath(this.options.templates);
        const templateFiles = await glob('**/*.hbs', { cwd: templatePath });
        console.log(chalk.blue(`Found ${templateFiles.length} template(s) in ${templatePath}`));

        for (const file of templateFiles) {
            const { meta, content } = await readTemplate(getTemplateFile(templatePath, file));
            const targetFileName = this.makeTargetFileName(file, this.options.name, meta);
            const context = new Context({
                ...meta,
                codegen: getCodegenMeta(),
                ...nowDateTime(),
                template: getRelativePath(getApplicationPath(), getFilePath(templatePath, file)),
                name: this.options.name,
                target: targetFileName,
            });
            await context.resolveUndefinedVars(content, file);
            const render = Handlebars.compile(content);
            const rendered = render(context.getAllVars());
            await writeFile(this.options.output, targetFileName, rendered);
        }
        succeedSpinner('Done');
    }

    makeTargetFileName(file: string, name: string, meta: TemplateMeta): string {
        return meta.target ? Handlebars.compile(meta.target)({ name }) : file.replace(/\.hbs$/, '');
    }
}
