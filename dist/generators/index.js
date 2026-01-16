import path from "path";
import fs from "fs-extra";
import Handlebars from "handlebars";
import chalk from "chalk";
import { registerHelpers } from "./helpers.js";
registerHelpers();
export async function generate(generatorName, templatesPath, artifactName, outputRoot) {
    const generatorFolder = path.join(templatesPath, generatorName);
    if (!fs.existsSync(generatorFolder))
        throw new Error(`Generator templates not found: ${generatorFolder}`);
    // auto-create output folder per language
    const outputFolder = path.resolve(outputRoot, generatorName);
    await fs.ensureDir(outputFolder);
    // read all template files in generator folder
    const files = await fs.readdir(generatorFolder);
    for (const file of files) {
        const templateFile = path.join(generatorFolder, file);
        const templateContent = await fs.readFile(templateFile, "utf-8");
        const template = Handlebars.compile(templateContent);
        const rendered = template({ name: artifactName });
        // output file has same name as template file
        const outputFileName = file.replace(".hbs", "").replace("class", artifactName);
        const outputFilePath = path.join(outputFolder, outputFileName);
        await fs.writeFile(outputFilePath, rendered);
        console.log(chalk.green(`Generated: ${outputFilePath}`));
    }
}
