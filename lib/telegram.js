// Sends a message to the configured Telegram chat.
// Credentials come from environment variables only (never hardcoded).
// If they are missing, it no-ops (returns false) so callers never crash.
export async function sendTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.warn('Telegram no configurado: falta TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID')
    return false
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    })
    const data = await res.json()
    if (!data.ok) {
      console.error('Telegram sendMessage error:', data)
      return false
    }
    return true
  } catch (err) {
    console.error('Telegram request failed:', err)
    return false
  }
}
