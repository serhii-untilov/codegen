import ora from 'ora';
const spinner = ora();
export function startSpinner(message) {
    spinner.start(message);
}
export function stopSpinner() {
    spinner.stop();
}
export function succeedSpinner(message) {
    spinner.succeed(message);
}
export function failSpinner(message) {
    spinner.fail(message);
}
