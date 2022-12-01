# action-extract-pr-data

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)

## About <a name = "about"></a>

JS action to extract PR data. Useful for end-to-end test where we need to have link to pr-deploy and tags for selected test run.

Made with [ncc](https://github.com/vercel/ncc) and debugged with [act](https://github.com/nektos/act).

## Getting Started <a name = "getting_started"></a>



### Prerequisites

For proper develop and maintaining you will need to install two things: one for bundling action into single executable, another - for local debug (if you want to debug action locally of course):

1. [nodejs](https://nodejs.org/en/) - please, use 16.x version since action internally use this version (available for custom JS actions: 12.x and 16.x) 
2. [ncc](https://github.com/vercel/ncc) - for bundling into into single executable file wit all node_modules
3. [act](https://github.com/nektos/act) - for debugging this action from other workflows where it used.

Develop flow:

1. You switch to node 16.x version
2. You make some changes in `index.mjs` file
3. You compile it with command 
```
ncc build index.mjs --license licenses.txt 
``` 
4. Commit and push
5. Update action's label
6. (optional) You use `act` to see how action works in some external workflows


## Usage <a name = "usage"></a>

You will need to pass three variables:
- access token
- PR number (if we use `on.pull_request` event - `github.event.number`)
- repository (`github.repository`)
