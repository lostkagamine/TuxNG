module.exports = {
    events: ['strikeAdd', 'strikeRemove', 'strikeSet'],
    isHandler: true,
    code: async (bot, type, u, c, reason) => {
        if (!await bot.db[u.guild.id].exists() || !await bot.db[u.guild.id].punishments.exists()) return;
        //if (!u) {return;}
        let formatReason = r => `${r ? `(Strike limit reached) ${r}` : 'Strike limit reached.'}`
        if (type === 'add') {
            let count = await bot.getStrikes(u)
            let p = await bot.db[u.guild.id].punishments.get
            for (let i of p) {
                if (count >= parseInt(i.count)) {
                    if (i.action === 'ban') {
                        await u.ban(formatReason(reason));
                        await bot.setStrikes(u, 0);
                    } else if (i.action === 'kick') {
                        await u.kick(7, formatReason(reason));
                    }
                }
            }
        }
    }
}