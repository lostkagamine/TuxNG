module.exports = {
    name: 'unban',
    description: 'Unbans a member.',
    perms: ['banMembers'],
    botPerms: ['banMembers'],
    code: async (ctx, args) => {
        let id = args.shift()
        if (id === undefined) {
            return await ctx.send(':x: | Provide a user ID.')
        }
        let reason = args.join(' ')
        if (reason === '') {
            reason = `[ Unban by ${ctx.author.username}#${ctx.author.discriminator} ]`
        } else {
            reason = `${ctx.author.username}#${ctx.author.discriminator}: ${reason}`
        }
        try {
            await ctx.guild.unbanMember(id, reason)
            await ctx.send(`:wrench: Unbanned \`${id}\`.`)
        } catch(e) {
            await ctx.send(':x: | Unable to unban user. They probably weren\'t banned, or the ID is wrong.')
        }
    }
}