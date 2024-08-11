const express = require('express');
require("dotenv").config();
const path = require('path');
const http = require("http");
const createHttpError = require('http-errors');
const cron = require('node-cron');
const { bot, startTelegramBot } = require('./bot/bot');
module.exports = class Application{
    #app = express();
    #PORT;
    constructor(PORT){
        this.#PORT = PORT;
        this.configApplication();
        this.createServer();
        this.setCookie();
        this.startBot();
        this.errorHandling();
    }
    configApplication(){
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({extended: true}));
        this.#app.use(express.static(path.join(__dirname, "./", "public"))); 
    }
    createServer(){
        const server = http.createServer(this.#app)
        server.listen(this.#PORT, () => {
            console.log(`run => http://localhost:${this.#PORT}`);
        })
    }
    async setCookie(){
        cron.schedule('0 3 * * 3', () => {
            const getV2rayCookie = async () => {
                const loginResponse = await axios.post(`${V2RAY_API_URL}/login`, {
                    username: V2RAY_USERNAME,
                    password: V2RAY_PASSWORD
                });
                process.env['V2RAY_TOKEN'] = loginResponse.headers['set-cookie'][0].split(';')[0];
                console.log(process.env['V2RAY_TOKEN']);
            }
            getV2rayCookie()
        })
    }
    startBot(){
        startTelegramBot()
    }
    errorHandling(){
        this.#app.use((req, res, next) => {
                next(createHttpError.NotFound("آدرس مورد نظر یافت نشد"))
        })
        this.#app.use((err, req, res, next) =>{
            console.log(err);
            const serverError = createHttpError.InternalServerError("خظای داخلی سرور")
            const message = err.message || serverError.message;
            bot.telegram.sendMessage('5803093467', `${message}`)
        })
    }
}