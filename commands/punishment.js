module.exports = {
    name: 'punishment',
    description: 'Set punishment rules for strikes.',
    perms: ['manageGuild'],
    code: async (ctx, args) => {
        if (!await ctx.bot.db[ctx.guild.id].punishments.exists()) {
            console.log('creating...')
            await ctx.bot.db[ctx.guild.id].punishments.set([])
        }
        if (!await ctx.bot.db[ctx.guild.id].exists()) {
            console.log('creating...')
            await ctx.bot.db[ctx.guild.id].set({settings: {}, punishments: []})
        }
        let count = args[0]
        let action = args[1]
        let validActions = ['kick', 'ban']
        let existing = await ctx.bot.db[ctx.guild.id].punishments.get;
        if (!(count || action)) {
            return await ctx.send(`Punishment list:\n${existing === [] ? 'No punishments registered.' : existing.map(a => `${a.count}: ${a.action}`).join('\n')}`)
        }
        let punishment = {};
        if (isNaN(parseInt(count))) return await ctx.send('Invalid number for count.')
        if (validActions.indexOf(action) === -1) return await ctx.send(`Invalid action. Valid actions: \`${validActions.join(', ')}\``)
        punishment.count = count
        punishment.action = action
        existing.push(punishment)
        await ctx.bot.db[ctx.guild.id].punishments.set(existing);
    }
}