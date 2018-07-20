module.exports = {
    name: 'settings',
    description: 'Manages Tuxedo\'s settings.',
    perms: ['manageGuild'],
    code: async (ctx, args) => {
        function parseBool(v) {
            return ['y', 'yes', 'true', 'on'].includes(v)
        }
        function parseRole(v) {
            // it expects a list of role names i guess meme
            return ctx.guild.roles.filter(a => a.name === v)
        }
        let validSettings = {
            automod_invites: {name: 'Invite Automod',
                test: v => { parseBool(v); return true; },
                value: v => parseBool(v)},
            invite_strikes: {name: 'Invite Strikes',
                test: v => { return !isNaN(parseInt(v)) },
                value: v => parseInt(v)},
            fake_invites: {name: 'Block Fake Invites via Automod - Turn this on for discord.me/io detection to work.',
                test: v => { parseBool(v); return true; },
                value: v => parseBool(v)}
        }
        if (!await ctx.bot.db[ctx.guild.id].exists()) {
            console.log('creating...')
            await ctx.bot.db[ctx.guild.id].set({settings: {}, punishments: []})
        }
        if (!args[0]) {
            let s = '**Tuxedo Settings Panel**\n\n'
            for (let a in validSettings) {
                let thing = await ctx.bot.db[ctx.guild.id].settings[a].get
                s += `${validSettings[a].name} (${a}): ${thing || 'Not set.'}\n\n`
            }
            await ctx.send(s)
        } else if (args[0] && !args[1]) {
            if (!(args[0] in validSettings)) {
                return await ctx.send('Invalid value to query.')
            }
            let value = await ctx.bot.db[ctx.guild.id].settings[args[0]].get
            await ctx.send(`${validSettings[args[0]].name} (${args[0]}): ${value || 'Off/Not set.'}`)
        } else {
            let key = args.shift()
            let value = args.join(' ')
            if (!(key in validSettings)) {
                return await ctx.send('Invalid value to set. Valid values: `' + Object.keys(validSettings).join(', ') + '`')
            }
            try {
                let val = validSettings[key].test(value)
                if (!val) {
                    return await ctx.send('Your input doesn\'t pass tests. Are you sure it\'s the right value?')
                }
            } catch(e) {
                return await ctx.send('Your input doesn\'t pass tests. Are you sure it\'s the right value?')
            }
            let res = validSettings[key].value(value)
            await ctx.bot.db[ctx.guild.id].settings[key].set(res);
            await ctx.send('Successfully set.')
        }
    },
    aliases: ['setting', 'set']
}