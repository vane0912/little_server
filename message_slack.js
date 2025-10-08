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
				"text": "*UK ETA Translations Missing*"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "rich_text",
			"elements": [
				{
					"type": "rich_text_section",
					"elements": [
						{
							"type": "text",
							"text": `Pre Payment: `,
							"style": {
								"bold": true
							}
						},
						{
							"type": "text",
							"text": `${body.pre_payment}`
						}
					]
				}
			]
		},
		{
			"type": "rich_text",
			"elements": [
				{
					"type": "rich_text_section",
					"elements": [
						{
							"type": "text",
							"text": "Missing Translations: ",
							"style": {
								"bold": true
							}
						},
						{
							"type": "text",
							"text": `${body.pre_payment_missing.length > 0 ? body.pre_payment_missing : "No Translations are Missing"}`
						}
					]
				}
			]
		},
		{
			"type": "divider"
		},
		{
			"type": "rich_text",
			"elements": [
				{
					"type": "rich_text_section",
					"elements": [
						{
							"type": "text",
							"text": "Post Payment: ",
							"style": {
								"bold": true
							}
						},
						{
							"type": "text",
							"text": `${body.post_payment}`
						}
					]
				}
			]
		},
		{
			"type": "rich_text",
			"elements": [
				{
					"type": "rich_text_section",
					"elements": [
						{
							"type": "text",
							"text": "Missing Translations: ",
							"style": {
								"bold": true
							}
						},
						{
							"type": "text",
							"text": `${body.post_payment_missing.length > 0 ? body.post_payment_missing : "No Translations are Missing"}`
						}
					]
				}
			]
		},
		{
			"type": "divider"
		},
		{
			"type": "rich_text",
			"elements": [
				{
					"type": "rich_text_section",
					"elements": [
						{
							"type": "text",
							"text": "Tested On: ",
							"style": {
								"bold": true
							}
						},
						{
							"type": "text",
							"text": `${body.deployment}`
						}
					]
				}
			]
		},
		{
			"type": "rich_text",
			"elements": [
				{
					"type": "rich_text_section",
					"elements": [
						{
							"type": "text",
							"text": "Language: ",
							"style": {
								"bold": true
							}
						},
						{
							"type": "text",
							"text": "Korean"
						}
					]
				}
			]
		}
	],
    channel: process.env.CONVERSATION_ID,
  });

  console.log(`Successfully send message ${result} in conversation ${process.env.CONVERSATION_ID}`);
};

module.exports = { send_message }