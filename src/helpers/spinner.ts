import ora from 'ora';

const spinner = ora();

export function startSpinner(message: string) {
    spinner.start(message);
}

export function stopSpinner() {
    spinner.stop();
}

export function succeedSpinner(message: string) {
    spinner.succeed(message);
}

export function failSpinner(message: string) {
    spinner.fail(message);
}
