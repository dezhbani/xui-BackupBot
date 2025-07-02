const fs = require('fs');
const path = require('path');
const { configService } = require("../services/config.service");

const getConfigs = async bot => {
    const configs = await configService.getConfigs();

    const dirPath = path.join(__dirname, '..', 'temp');
    const jsonFilePath = path.join(dirPath, 'data.json');
    const jsonData = JSON.stringify(configs, null, 2);

    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFile(jsonFilePath, jsonData, (err) => {
        if (err) {
            bot.telegram.sendMessage('5803093467', `Error writing file ${err}`);
        } else {
            bot.telegram.sendMessage('5803093467', 'File has been written successfully');
        }
    });

    return configs;
}

module.exports = {
    getConfigs
}
