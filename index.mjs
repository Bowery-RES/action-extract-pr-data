import { setOutput, getInput, setFailed } from '@actions/core';
import { getOctokit } from '@actions/github';

const inputs = {
  token: "gh_token",
  prNumber: "pr_number",
  repository: "repository"
}
const evalInput = (inputName) => {
  return process.env.GH_DEBUG == 1 ? process.env[inputName] : getInput(inputName) 
} 

const octokit = getOctokit(evalInput(inputs.token));

try {
  let pr = await octokit.request(
    `GET /repos/${evalInput(inputs.repository)}/pulls/${evalInput(inputs.prNumber)}`
  );
  let isCompPlexLabel = pr.data.labels.find(obj => obj.name === "compplex-e2e")
  let isWebAppLabel = pr.data.labels.find(obj => obj.name === "webapp-e2e")

  if(isCompPlexLabel){
    console.log("find the commentary and output the link");
    debugger
  }
  if(isWebAppLabel){
    console.log("find the comment and output the link");
    debugger
  }

  debugger
} catch (error) {
  setFailed(error.message);
}
