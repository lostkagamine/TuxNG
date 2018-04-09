module.exports = {
    name: 'settings',
    description: 'Manages nxtbot\'s settings.',
    perms: ['manageGuild'],
    code: async (ctx, args) => {
        let validSettings = {
            automod: 'Automod',
            kickStrikes: 'Kick Strikes',
            banStrikes: 'Ban Strikes'
        }
        if (!await ctx.bot.db[ctx.guild.id].exists()) {
            console.log('creating...')
            await ctx.bot.db[ctx.guild.id].set({settings: {g: ctx.guild.id}})
        }
        if (!args[0]) {
            let s = '**nxtbot Settings Panel**\n\n'
            for (let a in validSettings) {
                let thing = await ctx.bot.db[ctx.guild.id].settings[a].get
                s += `${validSettings[a]} (${a}): ${thing || 'Not set.'}\n\n`
            }
            await ctx.send(s)
            
        } else if (args[0] && !args[1]) {
            if (!(args[0] in validSettings)) {
                return await ctx.send('Invalid value to query.')
            }
            let value = await ctx.bot.db[ctx.guild.id].settings[args[0]].get
            await ctx.send(`${validSettings[args[0]]} (${args[0]}): ${value || 'Not set.'}`)
        }
    }
}