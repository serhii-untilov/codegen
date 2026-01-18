import chalk from 'chalk';
import { glob } from 'glob';
import Handlebars from 'handlebars';
import { getTemplateContent, getTemplateFile, getTemplateName, getTemplatePath } from '../fs/reader.js';
import { makeOutputFilePath, makeOutputFolder, writeFile } from '../fs/writer.js';
import { getCodegenMeta } from '../helpers/meta.js';
import { startSpinner, succeedSpinner } from '../helpers/spinner.js';
import { Vars } from './vars.js';
export class Generator {
    constructor(templatesFolder, artifactName, outputRoot) {
        this.templatesFolder = templatesFolder;
        this.artifactName = artifactName;
        this.outputRoot = outputRoot;
    }
    async run() {
        startSpinner('Generating...');
        const templatesPath = getTemplatePath(this.templatesFolder);
        const templateFiles = await glob('**/*.hbs', { cwd: templatesPath });
        console.log(chalk.blue(`Found ${templateFiles.length} template(s) in ${templatesPath}`));
        for (const file of templateFiles) {
            const templateContent = await getTemplateContent(getTemplateFile(templatesPath, file));
            const meta = getCodegenMeta({ template: getTemplateName(this.templatesFolder, file) });
            const vars = new Vars({ ...meta, name: this.artifactName });
            await vars.resolveUndefinedVars(templateContent, file);
            const template = Handlebars.compile(templateContent);
            const rendered = template(vars.getAllVars());
            const outputFolder = await makeOutputFolder(this.outputRoot, templatesPath, file, this.artifactName);
            await writeFile(makeOutputFilePath(outputFolder, file, this.artifactName), rendered);
        }
        succeedSpinner('Done');
    }
}
