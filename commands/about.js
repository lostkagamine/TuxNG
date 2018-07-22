module.exports = {
    name: 'about',
    description: 'About me.',
    code: async (ctx, args) => {
        let pkg = require('../package.json')
        let msg = {
            embed: {
                title: 'Tuxedo',
                color: 0x36393E,
                url: 'https://github.com/ry00001/TuxNG',
                description: `Hi, I'm Tuxedo, your moderation bot. I was made to be as fast and as simple as possible.`,
                fields: [
                    {
                        name: 'Bot owners',
                        value: `\`\`\`${ctx.bot.owners.map(a => {
                            let user = ctx.bot.users.get(a);
                            return `${user.username}#${user.discriminator} (${user.id})`
                        }).join('\n')}\`\`\``,
                        inline: false
                    },
                    {
                        name: 'Version',
                        value: `\`\`\`${pkg.version}\`\`\``
                    },
                    {
                        name: 'Powered by',
                        value: '```'+Object.keys(pkg.dependencies).map(a => `${a} (${pkg.dependencies[a]})`).join('\n')+'```'
                    }
                ]
            }
        }
        await ctx.send(msg)
    }
}
