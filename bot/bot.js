const {Telegraf} = require('telegraf');
const { getConfigs } = require('./getBackup');
const path = require('path')
const fs = require('fs')
const cron = require('node-cron');

const bot = new Telegraf('6702289698:AAEgjePDdCmEYyhxw7vvzgcTtjzoJ1iBSRA');
const startTelegramBot = async () =>{
    const jsonFilePath = path.join(__dirname, '..', 'data.json');

  bot.command('get', async ctx => {
    try {
      getConfigs(bot)
      await ctx.replyWithDocument( {
        source: jsonFilePath,
        filename: 'data.json',
        contentType: 'application/json'
      });
    } catch (error) {
      // console.error('Error sending document:', error);
      ctx.reply('Error occurred while sending the file.');
    }
  })
  cron.schedule('0 * * * *', async () => {
    getConfigs(bot)
    bot.telegram.sendMessage('5803093467', 'salam')

  // Read the JSON file
  try {
    // Send the JSON file as a document
    await bot.telegram.sendDocument(5803093467, {
      source: jsonFilePath,
      filename: 'data.json',
      contentType: 'application/json'
    });
  } catch (error) {
    // console.error('Error sending document:', error);
    ctx.reply('Error occurred while sending the file.');
  }
})
    bot.launch();
}

module.exports = {
  startTelegramBot, 
  bot
}