module.exports = {
    name: 'hello',
    description: 'Hello world!',
    dmable: true,
    code: async (ctx, args) => {
        await ctx.send('Hello, world.')
    },
    perms: []
}