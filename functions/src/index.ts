import * as functions from 'firebase-functions/v1'
import { initializeApp } from 'firebase-admin/app'

initializeApp()

interface BrevoEmailPayload {
  sender: { name: string; email: string }
  to: { email: string }[]
  subject: string
  htmlContent: string
}

async function sendAdminNotificationEmail(
  email: string,
  displayName: string,
  createdAt: string,
): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY
  const adminEmail = process.env.ADMIN_EMAIL

  if (!apiKey || !adminEmail) {
    console.warn('[onNewUser] Missing BREVO_API_KEY or ADMIN_EMAIL — email skipped')
    return
  }

  const payload: BrevoEmailPayload = {
    sender: { name: 'Muskle', email: 'contact@muskle.club' },
    to: [{ email: adminEmail }],
    subject: `🎉 Nouvel utilisateur Muskle : ${email || 'sans email'}`,
    htmlContent: `
      <h2>Nouvel utilisateur Muskle</h2>
      <ul>
        <li><strong>Email :</strong> ${email || '—'}</li>
        <li><strong>Nom :</strong> ${displayName || '—'}</li>
        <li><strong>Inscription :</strong> ${createdAt}</li>
      </ul>
    `,
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Brevo API error ${response.status}: ${body}`)
  }
}

export const onNewUser = functions.auth.user().onCreate(async (user) => {
  const email = user.email ?? ''
  const displayName = user.displayName ?? ''
  const createdAt = user.metadata.creationTime ?? new Date().toISOString()

  try {
    await sendAdminNotificationEmail(email, displayName, createdAt)
    console.log(`[onNewUser] Notification sent for ${email || user.uid}`)
  } catch (err) {
    console.error('[onNewUser] Failed to send notification email', err)
  }
})