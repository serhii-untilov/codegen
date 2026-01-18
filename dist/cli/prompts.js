import inquirer from 'inquirer';
export async function resolveName(name) {
    if (name !== '?') {
        return name;
    }
    const { artifactName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'artifactName',
            message: 'Enter name for generated artifact:',
            validate: (input) => input.trim().length > 0 || 'Name cannot be empty',
        },
    ]);
    return artifactName;
}
export async function resolveOutputFolder(name) {
    if (name !== '?') {
        return name;
    }
    const { outputFolderName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'outputFolderName',
            message: 'Enter name for the output folder name:',
            validate: (input) => input.trim().length > 0 || 'Folder name cannot be empty',
        },
    ]);
    return outputFolderName;
}
export async function getAnswers(vars) {
    return await inquirer.prompt(vars.map((name) => ({
        type: 'input',
        name,
        message: `Enter ${name}:`,
    })));
}
