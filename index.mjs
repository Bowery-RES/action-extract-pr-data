import { setOutput, getInput, setFailed } from '@actions/core';
import { getOctokit } from '@actions/github';

/**
 * This object is intended to store values of env variables for localhost debug.
 * If env var `GH_DEBUG='1'` - inputs for actions will be evaluated from environment but not from Action's input
 */
const inputs = {
  token: "GH_TOKEN",
  prNumber: "PR",
  repository: "REPO"
}

const evalInput = (inputName) => {
  return process.env.GH_DEBUG === 1 ? process.env[`${inputName}`] : getInput(inputName) 
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
    let commentCompplexDeploy = isUndefined(
      comments.data.find(
        comment => comment.body.includes("CompPlex review app")
      ), "Failed to find comment with Comp-plex PR deploy link"
    );
    let linkCompplexDeploy = new URL(
      commentCompplexDeploy.body.split(" ").find(val=> val.startsWith('https://compplex-client-review'))
    ); 
    console.log(`Comp-plex PR deploy link: ${linkCompplexDeploy.origin}`);
    setOutput("compplex_link", linkCompplexDeploy.origin);
  }
  if(isWebAppLabel){
    let commentWebAppDeploy = isUndefined(
      comments.data.find(
        comment => comment.body.includes("Webapp review app")
        ), "Failed to find comment with WebApp PR deploy link"
    );
    let linkWebAppDeploy = new URL(
      commentWebAppDeploy.body.split(" ").find(val=> val.startsWith("https://pr"))
    ); 
    console.log(`WebApp PR deploy link: ${linkWebAppDeploy.origin}`);
    setOutput("webapp_link", linkWebAppDeploy.origin);
  }
} catch (error) {
  setFailed(error.message);
}

function isUndefined(value, message = "Value is undefined."){
  if(typeof value === 'undefined'){
    throw new Error(message)
  }
  return value;
}