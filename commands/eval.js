module.exports = {
    name: 'eval',
    description: 'Runs JavaScript code. Owner-only, for obvious reasons.',
    dmable: true,
    code: async (ctx, args) => {
        let code = args.join(' ')
        try {
            let result = eval(code)
            if (result && typeof result.then === 'function') result = await result;
            await ctx.send(`\`\`\`\n${result}\`\`\``)
        } catch(e) {
            await ctx.send(`\`\`\`\n${e.stack}\`\`\``)
        }
    },
    ownerOnly: true,
    aliases: ['ev', 'e']
}