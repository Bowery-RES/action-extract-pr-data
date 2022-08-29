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
  let sha = pr.data.head.sha;

  let deploys = await octokit.request(
    `GET /repos/${evalInput(inputs.repository)}/deployments?per_page=100`
  );
  let deploy = deploys.data.find(deploy => deploy.sha == sha);
  
  let deployUrl = deploy.payload.web_url;

  setOutput("env_url",deployUrl)
  console.log(deployUrl)
} catch (error) {
  setFailed(error.message);
}