module.exports = {
    name: 'hello',
    description: 'Hello world!',
    code: async (ctx, args) => {
        ctx.send('Hello, world.')
    },
    perms: []
}