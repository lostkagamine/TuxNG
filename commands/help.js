module.exports = {
    name: 'help',
    description: 'Where you are.',
    dmable: true,
    code: async (ctx, args) => {
        let str = '```ini\n'
        for (let i of ctx.bot.commands) {
            if (i.ownerOnly && !ctx.bot.owners.includes(ctx.author.id)) continue;
            if (i.hidden) continue;
            str += `[${i.name}]${i.aliases.join(', ') !== '' ? ' (' + i.aliases.join(', ') + ')' : ''}\n${i.description !== undefined ? i.description : 'No description.'}\n`
        }
        str += '```'
        await ctx.send(str)
    },
    perms: []
}