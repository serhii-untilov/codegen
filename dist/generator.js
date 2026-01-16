import path from "path";
import fs from "fs-extra";
import Handlebars from "handlebars";
import chalk from "chalk";
import { getOutputFileName, registerHelpers } from "./helpers.js";
import { glob } from "glob";
registerHelpers();
export async function generate(templatesPath, artifactName, outputRoot) {
    if (!fs.existsSync(templatesPath))
        throw new Error(`Templates folder not found: ${templatesPath}`);
    // read all template files in templatesPath folder
    const files = await glob("**/*.hbs", { cwd: templatesPath });
    console.log(chalk.blue(`Found ${files.length} template(s) in ${templatesPath}`));
    for (const file of files) {
        const templateFile = path.join(templatesPath, file);
        const templateContent = await fs.readFile(templateFile, "utf-8");
        const template = Handlebars.compile(templateContent);
        const rendered = template({ name: artifactName });
        const outputFolder = path.resolve(outputRoot, path.relative(templatesPath, path.dirname(templateFile)));
        await fs.ensureDir(outputFolder);
        const outputFileName = getOutputFileName(file, artifactName);
        const outputFilePath = path.join(outputFolder, outputFileName);
        await fs.writeFile(outputFilePath, rendered);
        console.log(chalk.green(`Generated: ${outputFilePath}`));
    }
}
