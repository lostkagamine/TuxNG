module.exports = {
    "name": "eval",
    "description": "Runs JavaScript code. Owner-only, for obvious reasons.",
    "code": async (ctx, args) => {
        let code = args.join(' ')
        try {
            let result = eval(code)
            ctx.send(`\`\`\`\n${result}\`\`\``)
        } catch (e) {
            ctx.send(`\`\`\`\n${e}\`\`\``)
        }
    },
    ownerOnly: true
}