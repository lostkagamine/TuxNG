module.exports = {
    // i know i've basically copy-pasted ban
    name: 'softban',
    description: 'Bans someone, then quickly unbans them.',
    perms: ['banMembers'],
    botPerms: ['banMembers'],
    dmable: false,
    code: async (ctx, args) => {
        let id = args.shift()
        if (id === undefined) {
            return await ctx.send(':x: | Provide a user mention or ID.')
        }
        let user = ctx.bot.parseUser(id, ctx.guild)
        let reason = args.join(' ')
        let u;
        if (user === undefined) {
            return await ctx.send('Invalid user.')
        } else {
            u = `${user.username}#${user.discriminator}`
        }
        if (reason === '') {
            reason = `[ Softban by ${ctx.author.username}#${ctx.author.discriminator} ]`
        } else {
            reason = `${ctx.author.username}#${ctx.author.discriminator}: ${reason}`
        }
        try {
            await user.ban(7, reason);
            await user.unban(reason)
            await ctx.send(`:banana: Softbanned ${u}.`)
        } catch(e) {
            await ctx.send(':x: | Unable to softban user. Check your role order.')
        }
    }
}