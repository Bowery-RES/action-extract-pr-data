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

  let commentsUrl = new URL(pr.data.comments_url) 
  let comments = await octokit.request(`GET ${commentsUrl.pathname}`)

  if(isCompPlexLabel){
    console.log("find the commentary and output the link");
    let commentCompplexDeploy = comments.data.find(
      comment => comment.body.includes("CompPlex review app")
    );
    let linkCompplexDeploy = new URL(
      commentCompplexDeploy.body.split(" ").find(val=> val.startsWith('https://compplex-client-review'))
    ); 
    console.log(linkCompplexDeploy.origin);
    setOutput("compplex_link", linkCompplexDeploy.origin);
    debugger
  }

  if(isWebAppLabel){
    console.log("find the comment and output the link");
    let commentWebAppDeploy = comments.data.find(
      comment => comment.body.includes("Webapp review app")
    );
    let linkWebAppDeploy = new URL(
      commentWebAppDeploy.body.split(" ").find(val=> val.startsWith("https://webapp"))
    ); 

    console.log(linkWebAppDeploy.origin);
    setOutput("webapp_link", linkWebAppDeploy.origin);
    debugger
  }

  debugger
} catch (error) {
  setFailed(error.message);
}
