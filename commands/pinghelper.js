module.exports = {
    name: 'pinghelper', 
    description: 'Ping an online helper in the Discord Bots server.',
    hidden: true,
    code: async (ctx, args) => {
        let priority = ctx.bot.priority
        if (!priority) return await ctx.send('Error occurred while fetching priority list.')
        if (ctx.guild.id !== '110373943822540800') return;
        priority = priority.map(a => ctx.guild.members.get(a))
        let toping = []
        for (let i of priority) {
            if (['idle', 'offline'].includes(i.status)) continue
            toping.push(i)
        }
        let online = []
        let dnd = []
        let mods = []
        for (let i of toping) {
            if (i.roles.includes('113379036524212224')) { mods.push(i); continue }
            if (i.status === 'online') online.push(i)
            else if (i.status === 'dnd') dnd.push(i)
            else throw new TypeError('uh what, this shouldn\'t have happened like ever but status != online or dnd')
        }
        toping = online.concat(dnd, mods) // wew thanks js why isn't + on arrays a thing yet
        console.log(toping.map(a => `${a.username}#${a.discriminator}`).join('\n'))
        toping = toping.map(a => a.id)
        if (ctx.member.roles.includes('407326634819977217')) toping = [ctx.member.id]
        let temp_args = args.join(' ') !== '' ? `**\n${args.join(' ')}**\n` : ' '
        let msg = `Helper Autoping:${temp_args}<@${toping[0]}> (by **${ctx.author.username}**)`
        await ctx.send(msg)
        // layout totally not stolen from sink:tm:
    },
    aliases: ['pinghelpers']
}