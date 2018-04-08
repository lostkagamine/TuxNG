// JYABA SKURIPUTO

const Eris = require('eris')
const handler = require('./src/handler.js')
const config = require('./config.json')
const bot = new handler.Nxtbot(config.discord.token, config.bot.prefixes, config.bot.options, config.bot.owners)

console.log('nxtbot starting...')

bot.on('ready', () => {
    console.log(`Ready, connected as ${bot.user.username}#${bot.user.discriminator} (${bot.user.id})`)
    if (!bot.bot) {
        console.log('nxtbot can only be ran under bot accounts. Exiting...')
        process.exit(1);
    }
})

bot.cmdEvent('commandError', async (ctx, err) => {
    await ctx.send(`oopsie woopsie, ry hecked up! >.<\nPlease send this detailed:tm: error:tm: information:tm: to him:\n\`\`\`\n${err}\`\`\` (in command ${ctx.command.name})`)
})

bot.connect();