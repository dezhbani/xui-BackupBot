const { Telegraf } = require('telegraf');
const { getConfigs } = require('./getBackup');
const path = require('path')
const fs = require('fs')
const cron = require('node-cron');
const { USER_TELEGRAM_CHATID, BOT_TOKEN } = process.env

const bot = new Telegraf(BOT_TOKEN);

const cache = require("../utils/cache");

const startTelegramBot = async () => {
  const V2RAY_TOKEN = cache.get('token')

  const dirPath = path.join(__dirname, '..', 'temp');
  const jsonFilePath = path.join(dirPath, 'data.json');

  // اطمینان از وجود پوشه temp
  if (!fs.existsSync(dirPath)) {
    console.log(dirPath);
    
    fs.mkdirSync(dirPath, { recursive: true });
  }

  console.log(jsonFilePath);
  // const dir = path.join(__dirname, '..', 'temp');
  bot.command('get', async ctx => {
    try {
      const result = await getConfigs(bot)
      // Send the JSON file as a document
      !!result && await ctx.replyWithDocument({
        source: jsonFilePath,
        filename: 'data.json',
        contentType: 'application/json'
      });
    } catch (error) {
      console.error('Error sending document:', error);
      ctx.reply('Error occurred while sending the file.');
    }
  })
  // bot.command('replace', async ctx => {
  //   try {
  //     getConfigs(bot)
  //     fs.readFile('../temp/data.json', 'utf8', (err, data) => {
  //         if (err) {
  //           console.error('Error reading file', err);
  //           return;
  //         }
  //         let id = 1;
  //         data.map(async config => {
  //             id = id + 1
  //             config.id = id
  //             const addConfig = await axios.post(`http://s1.delta-dev.top:1000/xui/inbound/add`, config, {
  //                 withCredentials: true,
  //                 headers: {
  //                     'Cookie': V2RAY_TOKEN
  //                 }
  //             })
  //         })
  //     })

  //   } catch (error) {
  //     // console.error('Error sending document:', error);
  //     ctx.reply('Error occurred while sending the file.');
  //   }
  // })
  cron.schedule('*/30 * * * *', async () => {
    try {
      const result = await getConfigs(bot)
      // Send the JSON file as a document
      !!result && await bot.telegram.sendDocument(USER_TELEGRAM_CHATID, {
        source: jsonFilePath,
        filename: 'data.json',
        contentType: 'application/json'
      });
    } catch (error) {
      console.error('Error sending document:', error);
      ctx.reply('Error occurred while sending the file.');
    }
  })
  bot.launch();
}

module.exports = {
  startTelegramBot,
  bot
}