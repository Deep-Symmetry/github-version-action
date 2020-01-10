const core = require('@actions/core');

try {
    const varName = core.getInput('var-name');
    core.exportVariable(varName, 'TBD!');
} catch (error) {
    core.setFailed(error.message);
}
