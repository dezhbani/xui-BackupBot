const {Telegraf} = require('telegraf');
const { getConfigs } = require('./getBackup');
const path = require('path')
const fs = require('fs')
const cron = require('node-cron');
const { USER_TELEGRAM_CHATID, BOT_TOKEN } = process.env

const bot = new Telegraf(BOT_TOKEN);

const cache = require("../utils/cache");

const startTelegramBot = async () =>{
  const V2RAY_TOKEN = cache.get('token')
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
  bot.command('replace', async ctx => {
    try {
      getConfigs(bot)
      fs.readFile('./data.json', 'utf8', (err, data) => {
          if (err) {
            console.error('Error reading file', err);
            return;
          }
          let id = 1;
          data.map(async config => {
              id = id + 1
              config.id = id
              const addConfig = await axios.post(`http://s1.delta-dev.top:1000/xui/inbound/add`, config, {
                  withCredentials: true,
                  headers: {
                      'Cookie': V2RAY_TOKEN
                  }
              })
          })
      })
          
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