module.exports = {
    "name": "eval",
    "description": "Runs JavaScript code. Owner-only, for obvious reasons.",
    "code": async (ctx, args) => {
        let code = args.join(' ')
        try {
            let result = eval(code)
            await ctx.send(`\`\`\`\n${result}\`\`\``)
        } catch (e) {
            await ctx.send(`\`\`\`\n${e}\`\`\``)
        }
    },
    ownerOnly: true
}