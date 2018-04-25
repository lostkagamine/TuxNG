module.exports = {
    name: 'about',
    description: 'About me.',
    code: async (ctx, args) => {
        let text = 'Hello, I\'m nxtbot. I\'m designed to make your life easier with comprehensive moderation. I was made in JavaScript by ry00001, and I am constantly updated.'
        await ctx.send(text)
    }
}
