module.exports = {
    name: 'error',
    ownerOnly: true,
    dmable: true,
    description: 'Causes nxtbot to throw an error',
    code: async (ctx, args) => {
        throw TypeError('Manually issued by user.')
    }
}