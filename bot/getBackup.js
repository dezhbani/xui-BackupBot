const { default: axios } = require("axios");
const fs = require('fs');

const cache = require("../utils/cache");

const { V2RAY_API_URL } = process.env

const getConfigs = async bot => {
    const V2RAY_TOKEN = cache.get('token')
    const configs = (await axios.post(`${V2RAY_API_URL}/xui/inbound/list`, {}, {
        withCredentials: true,
        headers: {
            'Cookie': V2RAY_TOKEN
        }
    })).data.obj
    const jsonData = JSON.stringify(configs, null, 2);
    fs.writeFile('./data.json', jsonData, (err) => {
        if (err) {
            bot.telegram.sendMessage('5803093467', `Error writing file ${err}`);
        } else {
            bot.telegram.sendMessage('5803093467', 'File has been written successfully');
        }
    });
    return configs
}

module.exports = {
    getConfigs
}