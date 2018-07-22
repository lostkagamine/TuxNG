module.exports = {
    events: ['messageCreate'],
    code: (bot, m) => {
        if (!m) return;
        let invitere = /(?:https?:\/\/)?discord(?:app)?\.(?:com|gg|me|io)\/(?: +)?(?:invite\/)?([a-zA-Z0-9_-]+)/
        let content = m.content
        if (!m.member) return;
        if (m.author.bot) return;
        if (!m.member.guild) return;
        if (!m.user) return; // oops
        let guild = m.member.guild;
        let punish = settings => {
            let me = guild.members.get(bot.user.id)
            bot.addStrike(m.member, settings.invite_strikes || 1, 'Posting invite link.')
            m.delete().catch(() => {})
        }
        bot.db[guild.id].settings.get.then(settings => {
            if (!guild) {
                // DM (but why are they trying to shill in the bot's DMs in the first place...?)
                return;
            }
            if (!settings) return; // fix unhandled promise rejection?
            if (invitere.test(content) && settings.automod_invites) {
                // oheck invite
                let match = invitere.exec(content)
                if (!match) return;
                if (settings.fake_invites) {
                    punish(settings);
                } else {
                    let invite = bot.getInvite(match[1]).then(i => {
                        if (!i) {
                            return; // invalid for some reason
                        }
                        if (i.guild.id === guild.id) {
                            return; // invite points to current guild
                        }
                        // invite detected AND invite was for different guild
                        punish(settings)
                    }).catch(i => {})
                }
            }
        })
    }
}