require('dotenv').config()

// GitHub config (overridable via env, defaults match the original n8n workflow)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const OWNER = process.env.GITHUB_OWNER || 'vanessagonzalez-aut'
const REPO = process.env.GITHUB_REPO || 'playwrightQA'
const URLS_FILE_PATH = process.env.GITHUB_URLS_FILE || 'tests/urls.js'

const API_BASE = 'https://api.github.com'

function authHeaders() {
  if (!GITHUB_TOKEN) {
    throw new Error('Missing GITHUB_TOKEN environment variable')
  }
  return {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': `${OWNER}-automations`,
  }
}

// Replaces the "HTTP Request" node: PATCH the TESTING_TYPE Actions variable.
async function setTestingType(testsValue) {
  const url = `${API_BASE}/repos/${OWNER}/${REPO}/actions/variables/TESTING_TYPE`
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'TESTING_TYPE', value: testsValue }),
  })

  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Failed to update TESTING_TYPE variable (${res.status}): ${detail}`)
  }
  return true
}

// Builds the content of tests/urls.js from the request body.
function buildUrlsFileContent({ tests, url, email, requester }) {
  const deploy_url =
    tests === 'production' ? 'https://ivisa.com/' : `${url}visachinaonline.com/`

  return (
    `const deploy_url = "${deploy_url}"\n` +
    `const general_url = "${url}"  \n` +
    `const email_test = "${email}"\n` +
    `const requester = "${requester}"\n` +
    `let Orders = [] \n` +
    `module.exports = {deploy_url,  email_test, Orders, general_url, requester}\n`
  )
}

// Replaces the "Update deploy url" GitHub node: edit tests/urls.js.
// The Contents API requires the current file SHA to update an existing file.
async function updateDeployUrl(body) {
  const fileUrl = `${API_BASE}/repos/${OWNER}/${REPO}/contents/${URLS_FILE_PATH}`

  // Fetch current SHA of the file (needed to update it).
  const getRes = await fetch(fileUrl, { headers: authHeaders() })
  if (!getRes.ok) {
    const detail = await getRes.text()
    throw new Error(`Failed to read ${URLS_FILE_PATH} (${getRes.status}): ${detail}`)
  }
  const current = await getRes.json()

  const content = buildUrlsFileContent(body)
  const putRes = await fetch(fileUrl, {
    method: 'PUT',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: body.url || 'update deploy url',
      content: Buffer.from(content, 'utf8').toString('base64'),
      sha: current.sha,
    }),
  })

  if (!putRes.ok) {
    const detail = await putRes.text()
    throw new Error(`Failed to update ${URLS_FILE_PATH} (${putRes.status}): ${detail}`)
  }
  return putRes.json()
}

// Runs the full "Run automations" flow: set variable, then update the file.
async function runAutomations(body) {
  await setTestingType(body.tests)
  return updateDeployUrl(body)
}

module.exports = { setTestingType, updateDeployUrl, runAutomations, buildUrlsFileContent }
