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
            let counts = p.map(a => parseInt(a.count)).filter(a => a < count)
            if (counts === []) return;
            let max = Math.max(...counts)
            let punishment = p[counts.indexOf(max)+1]
            if (!punishment) return;
            if (punishment.action === 'ban') {
                await u.ban(7, formatReason(reason)).catch(e => {});
                await bot.setStrikes(u, 0);
            } else if (punishment.action === 'kick') {
                await u.kick(formatReason(reason)).catch(e => {});
            } else if (punishment.action === 'softban') {
                await u.ban(7, formatReason(reason)).catch(e => {})
                await u.unban(formatReason(reason)).catch(e => {})
            }
        }
    }
}