module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(34);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 6:
/***/ (function() {

eval("require")("@actions/core");


/***/ }),

/***/ 34:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const core = __webpack_require__(6);
const exec = __webpack_require__(273);

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


/***/ }),

/***/ 273:
/***/ (function() {

eval("require")("@actions/exec");


/***/ })

/******/ });