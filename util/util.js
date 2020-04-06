const chalk = require('chalk');
const figlet = require('figlet');

/* Validation function to make sure we don't accept empty inputs */
function isEmpty(input) {
	return input.length !== 0;
};

/* https://stackoverflow.com/questions/9006988/node-js-on-windows-how-to-clear-console
    Escape sequence to clear the screen on the console. 
    Strict mode complains about this octal literal. */
const clearOutput = () => {
  process.stdout.write('\033c');
};

/* Show a header when the app is launched */
const displayBrand = (headerText) => {
  console.log(chalk.yellow(figlet.textSync(headerText, { horizontalLayout: 'full' })));
};

module.exports = {
  isEmpty,
  clearOutput,
  displayBrand
};