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
        let counts = existing.map(a => a.count)
        if (!(count || action)) {
            return await ctx.send(`Punishment list:\n${existing === [] ? 'No punishments registered.' : existing.map(a => `${a.count}: ${a.action}`).join('\n')}`)
        }
        let punishment = {};
        if (isNaN(parseInt(count))) return await ctx.send('Invalid number for count.')
        if (action === 'none' || action === 'off') {
            if (counts === []) return await ctx.send('No punishments to remove.');
            let punishment = existing[count-1]
            if (!punishment) return await ctx.send('No punishment exists at count.')
            existing.splice(existing.indexOf(punishment), 1)
            await ctx.bot.db[ctx.guild.id].punishments.set(existing);
            await ctx.send('Punishment deleted.')
            return;
        }
        if (validActions.indexOf(action) === -1) return await ctx.send(`Invalid action. Valid actions: \`${validActions.join(', ')}\``)
        if (counts.indexOf(count) !== -1) return await ctx.send(`:x: Duplicate punishment numbers are not allowed. First remove the current punishment with \`punishment ${count} off\`.`)
        punishment.count = count
        punishment.action = action
        existing.push(punishment)
        await ctx.bot.db[ctx.guild.id].punishments.set(existing);
        await ctx.send('Set punishment.')
    },
    aliases: ['punishments', 'strikes']
}