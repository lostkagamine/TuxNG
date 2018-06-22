/*
 * nxtbot
 * by your average cat, ry00001
 * version "I have no idea what I'm doing"
 * builds: passing (probably at least)
 */

const Eris = require('eris')
const handler = require('./src/handler.js')
const crypto = require('crypto');
const superagent = require('superagent')
var config = {};
if (process.env.CI) { 
    config = {
        discord: {
            token: 'FAKE'
        },
        bot: {
            prefixes: ['FAKE'],
            owners: ['12345'],
            options: {}
        },
        dbots: {
            priority: ['1', '2']
        }
    }
} else if (process.env.DOCKER) {
    // running in Docker, do a thing!
    config = {
        discord: {
            token: process.env.TOKEN
        },
        bot: {
            prefixes: process.env.PREFIXES.split(' / '),
            owners: process.env.OWNERS.split(' '),
            options: {},
            redis_url: process.env.REDIS
        },
        dbots: {
            priority: process.env.DBOTS_PRIO.split(',')
        }
    }
} else {
    config = require('./config.json')
}
const Redite = require('redite')
const util = require('util')
const bot = new handler.Nxtbot(config.discord.token, process.env.CI, config.bot.prefixes, config.bot.options, config.bot.owners, config)

console.log('nxtbot starting...')

const run = () => {
    let ci = process.env.CI
    if (ci) {
        console.log('Continuous Integration detected, loading all modules then exiting...');
        bot.loadDir(bot.options.commandsDir);
        process.exit(0);
    } else {
        bot.db = new Redite({url: config.bot.redis_url});
        bot.connect();
    }
}

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


var makeGuildInfo = g => {
    bot.db[g.id].get.then(a => {
        if (!a || !a.settings || !a.punishments) {
            console.log('Creating information for guild ' + g.name)
            bot.db[g.id].set({settings: {}, punishments: []})
        }
    })
}

var delGuildInfo = g => {
    console.log('Deleting information for guild ' + g.name)
    bot.db[g.id].set({})
}

bot.on('guildCreate', g => {
    makeGuildInfo(g)
    if (bot.config.bot.logging) {
        bot.createMessage(bot.config.bot.guild_channel, {
            embed: {
                title: `New guild: ${g.name} (${g.id})`,
                color: 0x00FF00,
                description: 'A new user has added nxtbot to their guild.',
                thumbnail: {
                    url: g.iconURL
                },
                fields: [
                    {
                        name: 'Owned by',
                        value: bot.users.get(g.ownerID) ? `${bot.users.get(g.ownerID).username}#${bot.users.get(g.ownerID).discriminator}` : '???',
                        inline: false
                    },
                    {
                        name: 'Members',
                        value: `${g.members.size} (${g.members.filter(a => a.bot).length} bots)`,
                        inline: false
                    }
                ]
            }
        })
    }
})

bot.on('guildDelete', g => {
    delGuildInfo(g) // clean up after ourselves
    if (bot.config.bot.logging) {
        bot.createMessage(bot.config.bot.guild_channel, {
            embed: {
                title: `Lost guild: ${g.name} (${g.id})`,
                color: 0xFF0000,
                description: 'Somebody has removed nxtbot from their guild.',
                thumbnail: {
                    url: g.iconURL
                },
                fields: [
                    {
                        name: 'Owned by',
                        value: bot.users.get(g.ownerID) ? `${bot.users.get(g.ownerID).username}#${bot.users.get(g.ownerID).discriminator}` : '???',
                        inline: false
                    },
                    {
                        name: 'Members',
                        value: `${g.members.size} (${g.members.filter(a => a.bot).length} bots)`,
                        inline: false
                    }
                ]
            }
        })
    }
})

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
        makeGuildInfo(guild[1]) // [1] is required because lol collections.
    }

    cycleGame();
    setInterval(() => cycleGame(), 120000)
})

bot.cmdEvent('commandError', async (ctx, err) => {
    let errcode = crypto.randomBytes(10).toString('hex')
    let etext = `\`\`\`${err.stack}\`\`\``
    if (etext.length > 2000) {
        superagent.post('https://hastebin.com/documents')
            .type('text/plain')
            .send(err.stack)
            .then(a => {
                etext = `[Error too long to display nicely](https://hastebin.com/${a.body.key})`
            })
    }
    await ctx.send({
        embed: {
            title: 'Command error',
            description: `Well, this is embarrassing. 
It appears an error has happened in nxtbot's source code.
This isn't your fault, but you may want to report this at [${ctx.bot.config.bot.support_text}](${ctx.bot.config.bot.support}). Be sure to quote the error code!`,
            fields: [{
                name: 'Error details',
                value: `\`\`\`${err}\`\`\``,
                inline: false
            },
            {
                name: 'Error code',
                value: errcode,
                inline: false
            }]
        }
    })
    ctx.bot.createMessage(ctx.bot.config.bot.error_channel, {
        embed: {
            title: `Command error in \`${ctx.command.name}\``,
            description: 'Error occurred while processing command',
            fields: [{
                name: 'Error details (stacktrace)',
                value: etext,
                inline: false
            },
            {
                name: 'Error code',
                value: errcode,
                inline: false
            }]
        }
    })
})

bot.cmdEvent('commandNoDM', async ctx => {
    await ctx.send(':x: | This command cannot be used in Direct Messages.')
})

bot.cmdEvent('commandNotOwner', async ctx => { 
    let msgs = ['...Nope.',
        'Nice try, but did you really think I\'d let you?',
        'Why even bother trying? Not like I\'ll let you.']
    await ctx.send(msgs[Math.floor(Math.random() * msgs.length)])
})

bot.cmdEvent('commandNoPermissions', async ctx => {
    await ctx.send(':no_entry_sign: | Invalid permissions.')
})

bot.cmdEvent('commandBotNoPermissions', async ctx => {
    await ctx.send(':no_entry_sign: | The bot doesn\'t have enough permissions to run this.')
})

run();