module.exports = {
    // i know i've basically copy-pasted kick dont kill me
    name: 'ban',
    description: 'Bans someone.',
    perms: ['banMembers'],
    botPerms: ['banMembers'],
    dmable: false,
    code: async (ctx, args) => {
        let user = ctx.bot.parseUser(args.shift(), ctx.guild)
        let reason = args.join(' ')
        if (user === undefined) {
            return await ctx.send(':x: | Invalid user.')
        }
        if (reason === '') {
            reason = `[${ctx.author.username}#${ctx.author.discriminator}]`
        } else {
            reason = `${ctx.author.username}#${ctx.author.discriminator}: ${reason}`
        }
        try {
            await user.ban(7, reason);
            await ctx.send(`:hammer: Banned ${user.username}#${user.discriminator}.`)
        } catch(e) {
            await ctx.send(':x: | Unable to ban user. Check your role order.')
        }
    }
}