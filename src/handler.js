/*
 * nxtbot Command handler
 * @author ry00001
 */

const Eris = require('eris');
const fs = require('fs');
const path = require('path')

class Nxtbot extends Eris.Client {
    constructor(token, prefixes = [], cmdOptions = {}) {
        super(token);
        this.commands = [];
        this.cevents = {};
        this.prefixes = prefixes;
        this.cmdOptions = cmdOptions

        this.on('ready', () => {
            // Housekeeping
            if (!this.cmdOptions.noMentionPrefix) {
                this.prefixes.push([`<@${this.user.id}>`, `<@!${this.user.id}>`])
            }
            if (this.prefixes === [] && this.cmdOptions.noMentionPrefix) {
                console.warn('Warning! The bot has no prefixes registered, and you have chosen to disable mention prefixes! Please add some prefixes or enable mention prefixes, as the bot will be un-triggerable until you do!')
            }

            this.loadDir(this.cmdOptions.commandsDir ? this.cmdOptions.commandsDir : './commands/')
        })

        this.on('messageCreate', m => {
            let ctx = new Context(this, m)
            let prefix = undefined;
            this.prefixes.forEach(i => {if (m.content.startsWith(i)) { prefix = i }})
            if (prefix === undefined) {
                // no prefix found; drop the message
                return;
            }
            let text = m.content.slice(prefix.length).split(' ')
            let cmdName = text.shift()
            let cmd = this.findCommand(cmdName)
            if (cmd === undefined) {
                // invalid command; drop it again - but fire an event
                this.cmdDispatch('invalidCommand', [ctx, cmdName])
                return;
            }
            // fire the command!
            cmd.invoke(ctx, text)
        })
    }

    loadCommand(cmdObj) {
        let cmd = new Command(cmdObj.name, cmdObj.code, cmdObj.description, cmdObj.perms)
        this.commands.push(cmd);
    }

    findCommand(name) {
        let command = undefined;
        this.commands.forEach(i => {
            if (i.name === name) {
                command = i;
            }
        })
        return command;
    }

    cmdEvent(name, code) {
        if (this.cevents[name] === undefined) {
            this.cevents[name] = []
        }
        this.cevents[name].push(code)
    }

    cmdDispatch(name, args) {
        if (!this.cevents[name]) return;
        this.cevents[name].forEach(i => i(args))
    }

    loadDir(commandsDir = './commands/') {
        fs.readdir(commandsDir, (e, files) => {
            files.forEach(a => {
                let c = require(path.resolve(commandsDir + a))
                if (this.cmdOptions.verbose) console.log(`Adding ${c.name}`)
                this.loadCommand(c)
            })
        })
    }
}

class Command {
    constructor(name, code, desc, perms) {
        this.name = name
        this.code = code
        this.desc = desc
        this.perms = perms
    }
    invoke(ctx, args) {
        this.code(ctx, args)
    }
}

class Context {
    constructor(bot, msg) {
        this.author = msg.author
        this.channel = msg.channel 
        this.message = msg
        this.me = msg.channel.guild.members.get(bot.user.id)
        this.bot = bot
    }

    send(content, file=undefined) {
        return this.bot.createMessage(this.channel.id, content, file)
    }
}

module.exports = { Nxtbot, Command, Context }