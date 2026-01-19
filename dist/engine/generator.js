/**
 * Main generation pipeline
 */
import chalk from 'chalk';
import { glob } from 'glob';
import Handlebars from 'handlebars';
import { getTemplateContent, getTemplateFile, getTemplatePath } from '../fs/reader.js';
import { makeOutputFilePath, makeOutputFolder, writeFile } from '../fs/writer.js';
import { getCodegenMeta } from '../helpers/meta.js';
import { startSpinner, succeedSpinner } from '../helpers/spinner.js';
import { Vars } from './vars.js';
import { getTemplateName } from '../fs/path.js';
export class Generator {
    constructor(options) {
        this.options = options;
    }
    async run() {
        startSpinner('Generating...');
        const templatesPath = getTemplatePath(this.options.templates);
        const templateFiles = await glob('**/*.hbs', { cwd: templatesPath });
        console.log(chalk.blue(`Found ${templateFiles.length} template(s) in ${templatesPath}`));
        for (const file of templateFiles) {
            const templateContent = await getTemplateContent(getTemplateFile(templatesPath, file));
            const meta = getCodegenMeta({ template: getTemplateName(this.options.templates, file) });
            const vars = new Vars({ ...meta, name: this.options.name });
            await vars.resolveUndefinedVars(templateContent, file);
            const template = Handlebars.compile(templateContent);
            const rendered = template(vars.getAllVars());
            const outputFolder = await makeOutputFolder(this.options.output, templatesPath, file, this.options.name);
            await writeFile(makeOutputFilePath(outputFolder, file, this.options.name), rendered);
        }
        succeedSpinner('Done');
    }
}
