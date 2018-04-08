// JYABA SKURIPUTO

const Eris = require('eris')
const handler = require('./src/handler.js')
const config = require('./config.json')
const bot = new handler.Nxtbot(config.discord.token, config.bot.prefixes, config.bot.options)

console.log('nxtbot starting...')

bot.on('ready', () => {
    console.log(`Ready, connected as ${bot.user.username}#${bot.user.discriminator} (${bot.user.id})`)
    if (!bot.bot) {
        console.log('nxtbot can only be ran under bot accounts. Exiting...')
        process.exit(1);
    }
    bot.loadDir();
})

bot.connect();