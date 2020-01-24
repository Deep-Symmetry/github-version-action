# GitHub Version Action

This action sets an environment variable to a non-developer
user-friendly description of the Maven version of the project,
inferred from the closest tag that is a direct ancestor of the current
commit whose name appears to represent a Maven version. This value can
then be used in filenames for build artifacts, etc. The name of the
environment variable which gets set defaults to `git_version`, but
this can be changed using the input `var-name`.

For example, if the closest matching tag is `v0.2.3-SNAPSHOT` or
`0.2.3-SNAPSHOT`, the environment variable will be set to
`"0.2.3-Preview"`. If the closest tag is `Version-1.0.3` or `1.0.3`,
the environment variable will be set to `1.0.3`.

Optionally you can also pass an input `tag-var-name`, which will cause
another environment variable with that name to be set to the raw git
tag name that was matched as the most recent version tag.

Optionally you can also pass an input `mvn-var-name`, which will cause
another environment variable with that name to be set to the maven
version implied by the most recent version tag (which simply removes
any leading "v" or "version" from the tag).

The environment variable(s) set by this action will be available to
subsequent steps in the same job in your workflow.

## Inputs

### `var-name`

The name of the environment variable to set. Default `git-version`.

## Outputs

There are no direct step outputs, only the environment variables
themselves.

## Example usage

```yaml
uses: Deep-Symmetry/github-version-action@v1
with:
  var-name: 'project_version'
  tag-var-name: 'version_tag'
```
