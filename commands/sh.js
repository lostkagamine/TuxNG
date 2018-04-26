const superagent = require('superagent')

module.exports = {
    name: 'sh',
    ownerOnly: true,
    description: 'Runs a shell command.',
    code: async (ctx, args) => {
        let process = require('child_process').spawnSync(args.shift(), args)
        let codes = {
            ENOENT: 'File not found.'
        }
        if (process.error) {
            await ctx.send(`${process.error.code}: ${codes[process.error.code]}`)
            return
        }
        let output = `\`\`\`${process.stdout.toString()}\n${process.stderr.toString()}\`\`\`Exited with code ${process.status}, PID ${process.pid}`
        let outputPost = `- Exit code: ${process.status}\n- PID: ${process.pid}\n\n- Stdout:\n\n${process.stdout.toString()}\n- Stderr:\n\n${process.stderr.toString()}`
        if (output.length > 2000) {
            superagent.post('https://hastebin.com/documents')
                .type('text/plain')
                .send(outputPost)
                .then(a => {
                    ctx.send(`https://hastebin.com/${a.body.key}`)
                })
        } else {
            await ctx.send(output)
        }
    }
}