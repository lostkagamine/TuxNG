module.exports = {
    "name": "help",
    "description": "Where you are.",
    "code": async (ctx, args) => {
        //throw new TypeError('a')
        let str = '```ini\n'
        for (let i of ctx.bot.commands) {
            str += `[${i.name}]\n${i.description !== undefined ? i.description : "No description."}\n`
        }
        str += '```'
        await ctx.send(str)
    },
    "perms": []
}