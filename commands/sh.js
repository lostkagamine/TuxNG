const superagent = require('superagent')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

module.exports = {
    name: 'sh',
    ownerOnly: true,
    description: 'Runs a shell command.',
    code: async (ctx, args) => {
        let errored = false // hacky hacky hacky aaa
        let errors = [
            'o heck',
            'o hek',
            'no u',
            'bad',
            'Life Depleted. Round Failed.',
            'You are dead.',
            'FAILURE',
            'It\'s over...',
            '500 Internal Server Error'
        ]
        let successes = [
            'You did it!',
            'Course clear!',
            'YOU ROCK!',
            'Stage completed!',
            '200 OK',
            'Grade A+ meme.',
            'Nice.',
            'I\'ll success your success.',
            '`!error`',
            'Go you.'
        ]
        let successColours = [
            0x2C2F33,
            0x55FF55,
            0x00FF00,
            0xC0FFEE,
            0x36393E,
            0x7289DA,
            0x99AAB5,
            0x23272A
        ]
        let failColours = [
            0xAC1D1C,
            0xC00C00,
            0xF00BA6,
            0xF02C35,
            0xCC5555,
            0xFA113D
        ]
        let format = s => `\`\`\`${s}\`\`\``
        let proc = await exec(args.join(' ')).catch(a => {
            ctx.send({
                embed: {
                    title: errors[Math.floor(Math.random() * errors.length)],
                    color: failColours[Math.floor(Math.random() * failColours.length)],
                    fields: [
                        {
                            name: 'stdout',
                            value: format(a.stdout || 'No output'),
                            inline: false
                        },
                        {
                            name: 'stderr',
                            value: format(a.stderr || 'No output'),
                            inline: false
                        }
                    ],
                    footer: {
                        text: `Error while executing command ${a.cmd} (exited with code ${a.code})`
                    }
                }
            })
            errored = true;
        })
        if (errored) return;
        let output = {
            title: successes[Math.floor(Math.random() * successes.length)],
            color: successColours[Math.floor(Math.random() * successColours.length)],
            fields: [
                {
                    name: 'stdout',
                    value: format(proc.stdout || 'No output'),
                    inline: false
                },
                {
                    name: 'stderr',
                    value: format(proc.stderr || 'No output'),
                    inline: false
                }
            ]
        }
        let outputPost = `- Stdout:\n\n${proc.stdout.toString()}\n- Stderr:\n\n${proc.stderr.toString()}`
        if (proc.stdout.length > 1024 || proc.stderr.length > 1024) {
            superagent.post('https://hastebin.com/documents')
                .type('text/plain')
                .send(outputPost)
                .then(a => {
                    ctx.send(`https://hastebin.com/${a.body.key}`)
                })
        } else {
            await ctx.send({
                embed: output
            })
        }
    }
}