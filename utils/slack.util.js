const { WebClient } = require('@slack/web-api');
require('dotenv').config();

const web = new WebClient(process.env.SLACK_TOKEN);

const sendSlackMessage = async (message, channel = null) => {
  const channelId = channel || process.env.SLACK_CHANNEL_ID;

  try {
    // 👇 Try to join the channel (will only work for public channels)
    await web.conversations.join({ channel: channelId }).catch(() => {});

    // 👇 Send the message
    const resp = await web.chat.postMessage({
      text: typeof message === 'string' ? message : 'Slack message sent',
      channel: channelId,
    });

    console.log('✅ Message sent:', resp.ts);
    return true;
  } catch (error) {
    console.error('❌ Error sending message:', error.data || error.message);
    throw error;
  }
};

module.exports = { sendSlackMessage };
