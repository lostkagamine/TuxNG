// JYABA SKURIPUTO

const Eris = require('eris')
const handler = require('./src/handler.js')
const config = require('./config.json')
const Redite = require('redite')
const util = require('util')
const bot = new handler.Nxtbot(config.discord.token, config.bot.prefixes, config.bot.options, config.bot.owners)
bot.db = new Redite({url: config.bot.redis_url});

console.log('nxtbot starting...')

bot.on('ready', () => {
    console.log(`Ready, connected as ${bot.user.username}#${bot.user.discriminator} (${bot.user.id})`)
    if (!bot.bot) {
        console.log('nxtbot can only be ran under bot accounts. Exiting...')
        process.exit(1);
    }

    bot.db.strikes.exists().then(r => {
        if (!r) {
            bot.db.strikes.set({})
        }
    })
})

bot.cmdEvent('commandError', async (ctx, err) => {
    await ctx.send(`oopsie woopsie, ry hecked up! >.<\nPlease send this detailed:tm: error:tm: information:tm: to him:\n\`\`\`\n${err}\`\`\` (in command ${ctx.command.name})`);
    console.error('[Command error] ' + util.inspect(err))
})

bot.cmdEvent('commandNoDM', async ctx => {
    await ctx.send(':x: | This command cannot be used in Direct Messages.')
})

bot.cmdEvent('commandNotOwner', async ctx => { await ctx.send('Nice try, but did you really think I\'d let you?') })

bot.cmdEvent('commandNoPermissions', async ctx => {
    await ctx.send(':no_entry_sign: | Invalid permissions.')
})

bot.cmdEvent('commandBotNoPermissions', async ctx => {
    await ctx.send(':no_entry_sign: | The bot doesn\'t have enough permissions to run this.')
})

bot.connect();