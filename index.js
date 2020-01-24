const core = require('@actions/core');
const exec = require('@actions/exec');

/** Returns true if the tag name supplied looks like it encodes a version. */
const isVersion = (tag) => /^(v(ersion)?)?-?\d+(\.\d+)*(-snapshot)?/i.test(tag);

try {
    const varName = core.getInput('var-name', { required: true });
    const tagVarName = core.getInput('tag-var-name');
    const mvnVarName = core.getInput('mvn-var-name');
    let result = '';
    const options = {};
    options.listeners = {
        stdout: (data) => {
            result += data.toString();
        }
    };
    (async () => {
        // Fetch all the tags
        await exec.exec('git', ['fetch', '--depth=1', 'origin', '+refs/tags/*:refs/tags/*']);

        // Fetch all the history
        await exec.exec('git', ['fetch', '--prune', '--unshallow']);

        // Now list all the tags on the current branch in reverse chronological order, collecting the output.
        await exec.exec('git', ['tag', '--sort=-taggerdate', '--merged'], options);
        const lines = result.split("\n");
        const rawVersion = lines.find(isVersion);
        const mvnVersion = rawVersion.replace(/^v(ersion)?-?/i, "");
        const version = mvnVersion.replace(/snapshot$/i, "Preview");
        core.exportVariable(varName, version);
        if (!!tagVarName) {
            core.exportVariable(tagVarName, rawVersion);
        }
        if (!!mvnVarName) {
            core.exportVariable(mvnVarName, mvnVersion);
        }
    })().catch(e => {
        core.setFailed(e.message);
    });
} catch (error) {
    core.setFailed(error.message);
}
