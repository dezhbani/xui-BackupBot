const express = require('express');
require("dotenv").config();
const path = require('path');
const http = require("http");
const createHttpError = require('http-errors');
const cron = require('node-cron');
const { bot, startTelegramBot } = require('./bot/bot');
const { default: axios } = require('axios');
const cache = require('./utils/cache');
const { configService } = require('./services/config.service');
const { V2RAY_API_URL, V2RAY_USERNAME, V2RAY_PASSWORD } = process.env

module.exports = class Application {
    #app = express();
    #PORT;
    constructor(PORT) {
        this.#PORT = PORT;
        this.configApplication();
        this.createServer();
        this.setCookie();
        this.startBot();
        this.errorHandling();
    }
    configApplication() {
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({ extended: true }));
        this.#app.use(express.static(path.join(__dirname, "./", "public")));
    }
    createServer() {
        const server = http.createServer(this.#app)
        server.listen(this.#PORT, () => {
            console.log(`run => http://localhost:${this.#PORT}`);
            bot.telegram.sendMessage('5803093467', `run => http://localhost:${this.#PORT}`);
        })
    }
    async setCookie() {
        const getV2rayCookie = async () => {
            const token = await configService.loginPanel()
            const cacheResult = cache.set("token", token)
            if (!cacheResult) throw createHttpError.InternalServerError("خطایی در دریافت توکن رخ داد")
                return token
        }
        bot.command("token", async () => {
            getV2rayCookie()
            const token = cache.get("token")
            bot.telegram.sendMessage('5803093467', token)
        })
        cron.schedule('0 3 * * 3', () => {
            getV2rayCookie()
        })
        getV2rayCookie()
    }
    startBot() {
        startTelegramBot()
    }
    errorHandling() {
        this.#app.use((req, res, next) => {
            next(createHttpError.NotFound("آدرس مورد نظر یافت نشد"))
        })
        this.#app.use((err, req, res, next) => {
            // console.log(err);
            const serverError = createHttpError.InternalServerError("خظای داخلی سرور")
            const message = err.message || serverError.message;
            bot.telegram.sendMessage('5803093467', `${message}`)
        })
    }
}