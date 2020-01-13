const core = require('@actions/core');
const exec = require('@actions/exec');

/** Returns true if the tag name supplied looks like it encodes a version. */
const isVersion = (tag) => /^(v(ersion)?)?-?\d+(\.\d+)*(-snapshot)?/i.test(tag);

try {
    const varName = core.getInput('var-name', { required: true });
    const tagVarName = core.getInput('tag-var-name');
    let result = '';
    const options = {};
    options.listeners = {
        stdout: (data) => {
            result += data.toString();
        }
    };
    (async () => {
        await exec.exec('git', ['for-each-ref', '--sort=taggerdate', '--format', "'%(tag)'", 'refs/tags'], options);
        const lines = result.split("\n");
        const rawVersion = lines.find(isVersion);
        const version = result.trim().replace(/^v(ersion)?-?/i, "").replace(/snapshot$/i, "Preview");
        core.exportVariable(varName, version);
        tagVarName && core.exportVariable(tagVarName, rawVersion);
    })().catch(e => {
        core.setFailed(e.message);
    });
} catch (error) {
    core.setFailed(error.message);
}
