module.exports = {
    name: 'settings',
    description: 'Manages nxtbot\'s settings.',
    perms: ['manageGuild'],
    code: async (ctx, args) => {
        let validSettings = {
            automod_invites: {name: 'Invite Automod',
                test: v => { !!v; return true; },
                value: v => !!v},
            invite_strikes: {name: 'Invite Strikes',
                test: v => { return !isNaN(parseInt(v)) },
                value: v => parseInt(v)}
        }
        if (!await ctx.bot.db[ctx.guild.id].exists()) {
            console.log('creating...')
            await ctx.bot.db[ctx.guild.id].set({settings: {}, punishments: []})
        }
        if (!args[0]) {
            let s = '**nxtbot Settings Panel**\n\n'
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
            await ctx.send(`${validSettings[args[0]].name} (${args[0]}): ${value || 'Not set.'}`)
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
    }
}