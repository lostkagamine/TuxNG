module.exports = {
    name: 'hello',
    description: 'Hello world!',
    code: async (ctx, args) => {
        await ctx.send('Hello, world.')
    },
    perms: []
}