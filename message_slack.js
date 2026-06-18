require('dotenv').config()
const { WebClient } = require('@slack/web-api');
const token = process.env.SLACK_BOT_TOKEN;

const web = new WebClient(token);


async function send_message(body){
  const result = await web.chat.postMessage({
  "blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": body.body
			}
		}
	],
    channel: process.env.CONVERSATION_ID,
  });

  console.log(`Successfully send message ${result} in conversation ${process.env.CONVERSATION_ID}`);
};

// Replaces the "Send results message to Slack" node.
// Posts the formatted automation results to the report channel.
async function send_report(body) {
  const stats = (body.report && body.report.stats) || {}
  const minutes = Math.floor((stats.duration || 0) / 60000)
  const successful = (stats.expected || 0) + (stats.flaky || 0)
  const failed = stats.unexpected || 0

  const text =
    `*Automation Results*\n\n` +
    `Requester: ${body.requester}\n` +
    `Branch: ${body.branch_url}\n` +
    `Email: ${body.email}\n\n` +
    `- Time running: ${minutes} minutes\n\n` +
    `- :party_blob: Succesful: ${successful} \n\n` +
    `- :sadmomment: Failed tests: ${failed}\n\n` +
    `Functionality report: https://vanessagonzalez-aut.github.io/playwrightQA/\n\n` +
    `Visual validations report: https://vanessagonzalez-aut.github.io/playwrightQA/${body.percy_url}/report.html`

  const channel = process.env.REPORT_CHANNEL_ID || 'C0ATN8W57T9'
  const result = await web.chat.postMessage({ channel, text })

  console.log(`Successfully sent report to conversation ${channel}`)
  return result
}

module.exports = { send_message, send_report }