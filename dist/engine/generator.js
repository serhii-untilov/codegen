import chalk from 'chalk';
import { glob } from 'glob';
import Handlebars from 'handlebars';
import { getTemplateContent, getTemplateFile, getTemplateName, getTemplatePath } from '../fs/reader.js';
import { makeOutputFilePath, makeOutputFolder, writeFile } from '../fs/writer.js';
import { getCodegenMeta } from '../helpers/meta.js';
import { startSpinner, succeedSpinner } from '../helpers/spinner.js';
import { registerTransformHelpers } from '../helpers/transforms.js';
import { getAllVars, initVars, resolveUndefinedVars } from './vars.js';
registerTransformHelpers();
export async function generate(templatesFolder, artifactName, outputRoot) {
    startSpinner('Generating...');
    const templatesPath = getTemplatePath(templatesFolder);
    const templateFiles = await glob('**/*.hbs', { cwd: templatesPath });
    console.log(chalk.blue(`Found ${templateFiles.length} template(s) in ${templatesPath}`));
    for (const file of templateFiles) {
        const templateFile = getTemplateFile(templatesPath, file);
        const templateContent = await getTemplateContent(templateFile);
        initVars({ name: artifactName, ...getCodegenMeta({ template: getTemplateName(templatesFolder, file) }) });
        await resolveUndefinedVars(templateContent, file);
        const template = Handlebars.compile(templateContent);
        const rendered = template(getAllVars());
        const outputFolder = await makeOutputFolder(outputRoot, templatesPath, file, artifactName);
        await writeFile(makeOutputFilePath(outputFolder, file, artifactName), rendered);
    }
    succeedSpinner('Done');
}
