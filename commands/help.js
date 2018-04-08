module.exports = {
    "name": "help",
    "description": "Where you are.",
    "code": (ctx, args) => {
        //throw new TypeError('a')
        let str = '```ini\n'
        for (let i of ctx.bot.commands) {
            str += `[${i.name}]\n${i.desc !== undefined ? i.desc : "No description."}\n`
        }
        str += '```'
        ctx.send(str)
    },
    "perms": []
}