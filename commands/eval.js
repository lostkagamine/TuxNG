const util = require('util')
const superagent = require('superagent')

module.exports = {
    name: 'eval',
    description: 'Runs JavaScript code. Owner-only, for obvious reasons.',
    dmable: true,
    code: async (ctx, args) => {
        let code = args.join(' ')
        try {
            let result = eval(code)
            if (result && typeof result.then === 'function') result = await result;
            let inspect = !/\/\/ ?no(?:-| )?inspect/.test(code)
            if (inspect) result = util.inspect(result)
            if (result.length > 2000) {
                superagent.post('https://hastebin.com/documents')
                    .type('text/plain')
                    .send(result)
                    .then(a => {
                        ctx.send(`https://hastebin.com/${a.body.key}`)
                    })
            } else {
                await ctx.send(`\`\`\`\n${result}\`\`\``)
            }
        } catch(e) {
            await ctx.send(`\`\`\`\n${e}\`\`\``)
        }
    },
    ownerOnly: true,
    aliases: ['ev', 'e']
}