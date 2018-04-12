// JYABA SKURIPUTO

const Eris = require('eris')
const handler = require('./src/handler.js')
const config = require('./config.json')
const Redite = require('redite')
const util = require('util')
const bot = new handler.Nxtbot(config.discord.token, config.bot.prefixes, config.bot.options, config.bot.owners)
bot.db = new Redite({url: config.bot.redis_url});

console.log('nxtbot starting...')

var currGame = 0;

var cycleGame = () => {
    let games = [
        {name: 'with hammers', type: 0},
        {name: 'for invites', type: 3},
        {name: 'the messages flow', type: 3},
        {name: 'the help command', type: 2},
        {name: 'with JavaScript', type: 0},
        {name: 'https://github.com/ry00001/nxtbot', type: 0}
    ]
    currGame++;
    if (currGame >= games.length) currGame = 0;
    bot.editStatus('online', {name: games[currGame].name + ` | ${bot.prefixes[0]}help - ${bot.guilds.size} servers`, type: games[currGame].type})
}

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

    for (let guild of bot.guilds) {
        bot.db[guild[1].id].get.then(a => {
            if (!a || !a.settings || !a.punishments) {
                console.log('Creating information for guild ' + guild[1].name)
                bot.db[guild[1].id].set({settings: {}, punishments: []})
            }
        })
    }

    cycleGame();
    setInterval(() => cycleGame(), 120000)
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