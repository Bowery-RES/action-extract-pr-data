import axios from 'axios'

const token = process.env.GH_TOKEN
const prNumber = process.env.PR_NUMBER
const repository = process.env.REPOSITORY

const apiUrl = () => `https://api.github.com/repos/${repository}`

const getPrSha = async (prNumber, ghToken) => {
  const res = await axios.get(`${apiUrl()}/pulls/${prNumber}`, {
    method: 'GET',
    headers: {
      Authorization: `token ${ghToken}`,
    },
  })
  return res.data.head.sha
}

const getPrDeployLink = async (sha,ghToken) => {
  const res = await axios
  .get(`${apiUrl()}/deployments?per_page=100`, {
    method: 'GET',
    headers: {
      Authorization: `token ${ghToken}`,
    },
  })
  return await res.data
  .find(deploy => deploy.sha == sha)
}

const sha = await getPrSha(prNumber,token)
// console.log(sha)
const prDeployLink = await getPrDeployLink(sha,token)
console.log(prDeployLink.payload.web_url);

