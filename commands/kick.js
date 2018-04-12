module.exports = {
    name: 'kick',
    description: 'Kicks someone.',
    perms: ['kickMembers'],
    botPerms: ['kickMembers'],
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
            await user.kick(reason);
            await ctx.send(`:hammer: Kicked ${user.username}#${user.discriminator}.`)
        } catch(e) {
            await ctx.send(':x: | Unable to kick user. Check your role order.')
        }
    }
}