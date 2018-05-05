module.exports = {
    name: 'help',
    description: 'Where you are.',
    dmable: true,
    code: async (ctx, args) => {
        //throw new TypeError('a') - why was this commented out :Thonk:
        let str = '```ini\n'
        for (let i of ctx.bot.commands) {
            if (i.ownerOnly && !ctx.bot.owners.includes(ctx.author.id)) continue;
            str += `[${i.name}]${i.aliases.join(', ') !== '' ? ' (' + i.aliases.join(', ') + ')' : ''}\n${i.description !== undefined ? i.description : 'No description.'}\n`
        }
        str += '```'
        await ctx.send(str)
    },
    perms: []
}