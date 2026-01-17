import chalk from 'chalk';
import fs from 'fs-extra';
import { glob } from 'glob';
import Handlebars from 'handlebars';
import ora from 'ora';
import path from 'path';
import { getAnswers, getOutputFileName, getUndefinedTemplateVariables, registerHelpers } from './helpers.js';
registerHelpers();
export async function generate(templatesPath, artifactName, outputRoot) {
    if (!fs.existsSync(templatesPath))
        throw new Error(`Templates folder not found: ${templatesPath}`);
    const spinner = ora('Generating...').start();
    // read all template files in templatesPath folder
    const files = await glob('**/*.hbs', { cwd: templatesPath });
    console.log(chalk.blue(`Found ${files.length} template(s) in ${templatesPath}`));
    const globalVariables = { name: artifactName };
    for (const file of files) {
        const templateFile = path.join(templatesPath, file);
        const templateContent = await fs.readFile(templateFile, 'utf-8');
        const undefinedVariables = getUndefinedTemplateVariables(templateContent, globalVariables);
        if (undefinedVariables.length > 0) {
            spinner.stop();
            console.log(chalk.yellow(`Template ${file} requires additional variables: ${undefinedVariables.join(', ')}`));
            const answers = await getAnswers(undefinedVariables);
            Object.assign(globalVariables, answers);
            spinner.start('Continuing generation...');
        }
        const template = Handlebars.compile(templateContent);
        const rendered = template(globalVariables);
        const relativePath = path.relative(templatesPath, path.dirname(templateFile));
        const outputPath = getOutputFileName(relativePath, artifactName);
        const outputFolder = path.resolve(outputRoot, outputPath);
        await fs.ensureDir(outputFolder);
        const outputFileName = getOutputFileName(path.basename(file), artifactName);
        const outputFilePath = path.join(outputFolder, outputFileName);
        await fs.writeFile(outputFilePath, rendered);
        console.log(chalk.green(`Generated: ${outputFilePath}`));
    }
    spinner.succeed('Done');
}
