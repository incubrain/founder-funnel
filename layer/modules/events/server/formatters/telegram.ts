import type { SpamFlags } from '../../server/utils/anti-spam'

export function formatTelegramMessage(
  data: {
    formData?: Record<string, any>
    flags: SpamFlags
  },
  chatId?: string,
) {
  if (!chatId) {
    throw createEvlogError({
      status: 500,
      message: 'Telegram chat ID is required',
      why: 'NUXT_TELEGRAM_CHAT_ID environment variable is not set',
      fix: 'Add NUXT_TELEGRAM_CHAT_ID to your .env file with your Telegram chat/group ID',
    })
  }

  const risk
    = data.flags.score > 50 ? '⚠️' : data.flags.score > 20 ? '⚡' : '✅'
  const primaryEmail = data.formData?.email || 'No Email'

  // Format fields for display
  const fieldList = Object.entries(data.formData || {})
    .filter(([key]) => key !== 'email') // Email is shown separately or at top
    .map(([key, value]) => `${key}: ${value}`)

  const telegramLines = [
    `${risk} New Lead`,
    '',
    `📧 ${primaryEmail}`,
    ...fieldList.map(f => `🔹 ${f}`),
    '',
    `📝 Form: ${data.formData?.formId}`,
  ]

  // Add spam flags if present
  if (data.flags.score > 0) {
    telegramLines.push('', `⚠️ Risk Score: ${data.flags.score}/100`)
    if (data.flags.fast) telegramLines.push('⚡ Fast submission')
    if (data.flags.noJs) telegramLines.push('🤖 No JavaScript')
  }

  return {
    chat_id: chatId,
    text: telegramLines.join('\n'),
  }
}
