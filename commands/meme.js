var command = {
    name: 'hello',
    description: 'Hello world!',
    code: (ctx, args) => {
        ctx.send('Hello, world.')
    },
    perms: []
}

module.exports = command;