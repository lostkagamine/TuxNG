/*
 * ErioJS Command handler
 * @author ry00001
 */

const Eris = require('eris');

class Bot extends Eris.Client {
    constructor(token) {
        super(token);
        this.commands = [];
        this.events = {};
        this.prefixes = [];
    }
}

class Command {
    constructor(name, code, desc, perms) {
        this.name = name
        this.code = code
        this.desc = desc
        this.perms = perms
    }
    async invoke(args) {
        this.code(args)
    }
}

module.exports = { Bot, Command }