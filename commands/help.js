module.exports = {
    name: 'help',
    description: 'Where you are.',
    dmable: true,
    code: async (ctx, args) => {
        //throw new TypeError('a')
        let str = '```ini\n'
        for (let i of ctx.bot.commands) {
            str += `[${i.name}]${i.aliases.join(', ') !== '' ? ' (' + i.aliases.join(', ') + ')' : ''}\n${i.description !== undefined ? i.description : 'No description.'}\n`
            // what the hell is that abomination above this comment
        }
        str += '```'
        await ctx.send(str)
    },
    perms: []
}