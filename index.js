const core = require('@actions/core');
const exec = require('@actions/exec');

try {
    const varName = core.getInput('var-name');
    let result = '';
    const options = {};
    options.listeners = {
        stdout: (data) => {
            result += data.toString();
        }
    };
    (async () => {
        await exec.exec('git', ['describe', '--abbrev=0'], options);
        const version = result.replace(/^v(ersion-?)?/i, "").replace(/snapshot$/i, "Preview");
        core.exportVariable(varName, version);
    })().catch(e => {
        core.setFailed(e.message);
    });
} catch (error) {
    core.setFailed(error.message);
}
