const {Telegraf} = require('telegraf');
const { getConfigs } = require('./getBackup');
const path = require('path')
const fs = require('fs')
const cron = require('node-cron');
const { USER_TELEGRAM_CHATID, BOT_TOKEN } = process.env

const bot = new Telegraf(BOT_TOKEN);
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
      try {
      getConfigs(bot)
      // Send the JSON file as a document
      await bot.telegram.sendDocument(USER_TELEGRAM_CHATID, {
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