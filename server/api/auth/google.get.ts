export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user }) {
    if (!allowedEmails.includes(user.email)) {
      throw createError({
        statusCode: 403,
        statusMessage: '您的帳號不在授權清單內',
      })
    }
    await setUserSession(event, { user })
    return sendRedirect(event, '/')
  },
})