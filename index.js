const core = require('@actions/core');
const exec = require('@actions/exec');

/** Returns true if the tag name supplied looks like it encodes a version. */
const isVersion = (tag) => /^(v(ersion)?)?-?\d+(\.\d+)*(-snapshot)?/i.test(tag);

try {
    const varName = core.getInput('var-name', { required: true });
    const tagVarName = core.getInput('tag-var-name');
    console.log(`varName=${varName}, tagVarName=${tagVarName}`);
    let result = '';
    const options = {};
    options.listeners = {
        stdout: (data) => {
            result += data.toString();
        }
    };
    (async () => {
        await exec.exec('git', ['tag', '--sort=taggerdate', '--merged'], options);
        console.log("result:", result);
        const lines = result.split("\n");
        console.log("lines:", lines);
        const rawVersion = lines.find(isVersion);
        console.log("rawVersion:", lines);
        const version = rawVersion.replace(/^v(ersion)?-?/i, "").replace(/snapshot$/i, "Preview");
        console.log(`rawVersion=${rawVersion}, version=${version}`);
        core.exportVariable(varName, version);
        if (!!tagVarName) {
            core.exportVariable(tagVarName, rawVersion);
        }
    })().catch(e => {
        core.setFailed(e.message);
    });
} catch (error) {
    core.setFailed(error.message);
}
