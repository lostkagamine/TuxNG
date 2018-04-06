const Eris = require('eris')
const handler = require('./src/handler.js')
const config = require('./config.json')
const bot = new handler.Bot(config.discord.token)

console.log('ErioJS starting...')

bot.connect();