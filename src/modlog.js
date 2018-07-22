/**
 * ModLogs for tuxng
 * @author ry00001
 */

const eris = require('eris')
const actions = eris.Constants.AuditLogActions

var actionNames = {
    20: 'Member Kick',
    22: 'Member Ban',
    23: 'Member Unban'
}

var emotes = {
    20: '🚪',
    22: '🔨',
    23: '🔧'
}

var colours = {
    20: 0xFFFF00,
    22: 0x00FF00,
    23: 0x00FFFF
}

class ModLogEntry {
    // I have no idea how to do this
    constructor(number, entry, guildlogs) {
        this.audit = entry;
        this.caseid = number;
        this.guildlogs = guildlogs;
        for (let i of Object.keys(entry)) {
            if (!entry[i]) return;
            this[i] = entry[i]; // set props
        }
    }

    toObject() {
        return {
            id: this.id,
            caseID: this.caseid,
            guild: {id: this.guild.id, ownerID: this.guild.ownerID, name: this.guild.name, verificationLevel: this.guild.verificationLevel},
            actionType: this.actionType,
            actionName: actionNames[this.actionType],
            user: {username: this.user.username, discriminator: this.user.discriminator, id: this.user.id, bot: this.user.bot},
            reason: this.reason,
            targetID: this.targetID
        }
    }

    toEmbed() {
        let user;
        for (let i of this.guildlogs.users) {
            if (i.id === this.audit.targetID) user = i;
        }
        // ^ when we run into caching issues I'll switch to REST ^
        return {
            title: emotes[this.actionType] + ' ' + actionNames[this.actionType],
            color: colours[this.actionType],
            fields: [
                {
                    name: 'Reason',
                    value: this.reason || 'No reason given.',
                    inline: false
                }
            ],
            author: {
                name: user ? `${user.username}#${user.discriminator} ${user.bot ? '[BOT]' : ''} (${user.id})` : user.id,
                icon_url: user ? user.avatarURL : ''
            },
            footer: {
                text: `${this.audit.user.username}#${this.audit.user.discriminator} (${this.audit.user.id})`,
                icon_url: this.audit.user.avatarURL
            }
        }
    }
}


module.exports = {ModLogEntry, actionNames}