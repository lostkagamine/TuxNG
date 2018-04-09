module.exports = {
    name: 'settings',
    description: 'Manages nxtbot\'s settings.',
    perms: ['manageGuild'],
    code: async (ctx, args) => {
        let validSettings = {
            automod: {name: 'Automod',
                test: v => { !!v; return true; },
                value: v => !!v},
            kickStrikes: {name: 'Kick Strikes',
                test: v => {  parseInt(v) },
                value: v => parseInt(v)},
            banStrikes: {name: 'Ban Strikes',
                test: v => { parseInt(v) },
                value: v => parseInt(v)}
        }
        if (!await ctx.bot.db[ctx.guild.id].exists()) {
            console.log('creating...')
            await ctx.bot.db[ctx.guild.id].set({settings: {g: ctx.guild.id}})
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
                validSettings[key].test(value)
            } catch(e) {
                return await ctx.send('Your input doesn\'t pass tests. Booleans will always pass - numbers may not, based on `parseInt`\'s output.')
            }
            let res = validSettings[key].test(value)
            await ctx.bot.db[ctx.guild.id].settings[key].set(res);
            await ctx.send('Successfully set.')
        }
    }
}