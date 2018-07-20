module.exports = {
    name: 'error',
    ownerOnly: true,
    dmable: true,
    description: 'Causes Tuxedo to throw an error',
    code: async (ctx, args) => {
        throw TypeError('Manually issued by user.')
    }
}