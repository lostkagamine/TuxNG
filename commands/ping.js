module.exports = {
    name: 'ping',
    description: 'Pings.',
    code: async (ctx, args) => {
        if (args[0] === 'me') {
            return await ctx.send(`<@${ctx.author.id}>`)
        }
        let calculating = [
            'Calculating...',
            'Processing...',
            'Wasting CPU time...',
            'Loading...',
            'Memeing...',
            'Crashing...',
            'Erroring...',
            'Pinging...',
            'Ponging...',
            'Buffering...'
        ]
        let pongs = [
            'Pong! {} ms.',
            'Is this where I\'m meant to say {}ms?',
            'Command received, processed and memed, only took {}ms.',
            '{}ms, about time.'
        ]
        let begin = new Date();
        let msg = await ctx.send(calculating[Math.floor(Math.random() * calculating.length)])
        let end = new Date();
        let text = pongs[Math.floor(Math.random() * pongs.length)]
        msg.edit(text.replace('{}', (end - begin)))
    }
}