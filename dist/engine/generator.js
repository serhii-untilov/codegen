import chalk from 'chalk';
import fs from 'fs-extra';
import { glob } from 'glob';
import Handlebars from 'handlebars';
import { getTemplateContent, getTemplateFile } from '../fs/reader.js';
import { makeOutputFilePath, makeOutputFolder, writeFile } from '../fs/writer.js';
import { getCodegenMeta } from '../helpers/meta.js';
import { startSpinner, succeedSpinner } from '../helpers/spinner.js';
import { registerTransformHelpers } from '../helpers/transforms.js';
import { addVars, getAllVars, resolveUndefinedVars } from './vars.js';
registerTransformHelpers();
export async function generate(templatesPath, artifactName, outputRoot) {
    if (!fs.existsSync(templatesPath))
        throw new Error(`Templates folder not found: ${templatesPath}`);
    startSpinner('Generating...');
    const templateFiles = await glob('**/*.hbs', { cwd: templatesPath });
    console.log(chalk.blue(`Found ${templateFiles.length} template(s) in ${templatesPath}`));
    addVars({ name: artifactName, ...getCodegenMeta() });
    for (const file of templateFiles) {
        const templateContent = await getTemplateContent(getTemplateFile(templatesPath, file));
        await resolveUndefinedVars(templateContent, file);
        const template = Handlebars.compile(templateContent);
        const rendered = template(getAllVars());
        const outputFolder = await makeOutputFolder(outputRoot, templatesPath, file, artifactName);
        await writeFile(makeOutputFilePath(outputFolder, file, artifactName), rendered);
    }
    succeedSpinner('Done');
}
