/**
 * Email sending utility with pluggable providers.
 *
 * Supports Resend, SendGrid, and a console-only mock for development.
 * Uses direct fetch() calls — no extra npm dependencies required.
 *
 * Set MAIL_PROVIDER in .env to choose: 'resend' | 'sendgrid' | 'console'
 */

interface ContactMessage {
  readonly name: string;
  readonly email: string;
  readonly message: string;
  readonly submittedAt: string;
}

interface SendResult {
  readonly isSuccess: boolean;
  readonly messageId?: string;
  readonly error?: string;
}

type MailProvider = 'resend' | 'sendgrid' | 'console';

const DEFAULT_RECIPIENT = 'seemooabid@gmail.com';

function getProvider(): MailProvider {
  const provider = process.env.MAIL_PROVIDER as MailProvider | undefined;
  if (provider === 'resend' || provider === 'sendgrid') return provider;
  return 'console';
}

function buildEmailHtml(data: ContactMessage): string {
  return `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d1a;border-radius:16px;overflow:hidden;border:1px solid rgba(108,99,255,0.2);">
      <div style="background:linear-gradient(135deg,#6c63ff,#00d4ff);padding:28px 32px;">
        <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">New Contact Message</h1>
        <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:13px;">via ABID.Dev Portfolio</p>
      </div>
      <div style="padding:28px 32px;">
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr>
            <td style="padding:8px 0;color:#a0a0c8;font-size:13px;width:70px;vertical-align:top;">From</td>
            <td style="padding:8px 0;color:#e0e0e0;font-size:15px;font-weight:600;">${escapeHtml(data.name)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#a0a0c8;font-size:13px;vertical-align:top;">Email</td>
            <td style="padding:8px 0;"><a href="mailto:${escapeHtml(data.email)}" style="color:#6c63ff;font-size:15px;text-decoration:none;">${escapeHtml(data.email)}</a></td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#a0a0c8;font-size:13px;vertical-align:top;">Date</td>
            <td style="padding:8px 0;color:#e0e0e0;font-size:14px;">${new Date(data.submittedAt).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}</td>
          </tr>
        </table>
        <div style="padding:20px;background:rgba(108,99,255,0.08);border-left:3px solid #6c63ff;border-radius:0 8px 8px 0;">
          <p style="color:#c0c0e0;font-size:15px;line-height:1.7;margin:0;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
        </div>
        <div style="margin-top:24px;text-align:center;">
          <a href="mailto:${escapeHtml(data.email)}?subject=Re:%20Portfolio%20Contact" style="display:inline-block;padding:10px 28px;background:linear-gradient(90deg,#6c63ff,#00d4ff);color:#fff;border-radius:999px;font-size:14px;font-weight:600;text-decoration:none;">Reply to ${escapeHtml(data.name)}</a>
        </div>
      </div>
      <div style="padding:16px 32px;border-top:1px solid rgba(108,99,255,0.15);text-align:center;">
        <p style="color:#606080;font-size:11px;margin:0;">Sent from your portfolio contact form</p>
      </div>
    </div>
  `;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function sendViaResend(data: ContactMessage): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey)
    return { isSuccess: false, error: 'RESEND_API_KEY is not configured' };
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from:
        process.env.RESEND_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || DEFAULT_RECIPIENT,
      reply_to: data.email,
      subject: `[Portfolio] New message from ${data.name}`,
      html: buildEmailHtml(data),
    }),
  });
  const result = await response.json();
  if (!response.ok)
    return { isSuccess: false, error: result.message || 'Resend API error' };
  return { isSuccess: true, messageId: result.id };
}

async function sendViaSendGrid(data: ContactMessage): Promise<SendResult> {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey)
    return { isSuccess: false, error: 'SENDGRID_API_KEY is not configured' };
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      personalizations: [
        { to: [{ email: process.env.CONTACT_EMAIL || DEFAULT_RECIPIENT }] },
      ],
      from: { email: process.env.SENDGRID_FROM_EMAIL || 'noreply@abid.dev' },
      reply_to: { email: data.email, name: data.name },
      subject: `[Portfolio] New message from ${data.name}`,
      content: [{ type: 'text/html', value: buildEmailHtml(data) }],
    }),
  });
  if (!response.ok) {
    const text = await response.text();
    return { isSuccess: false, error: text || 'SendGrid API error' };
  }
  const messageId = response.headers.get('x-message-id') || `sg-${Date.now()}`;
  return { isSuccess: true, messageId };
}

function sendViaConsole(data: ContactMessage): SendResult {
  /* eslint-disable no-console */
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║  📧  CONTACT FORM SUBMISSION (mock mode)        ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║  From:    ${data.name}`);
  console.log(`║  Email:   ${data.email}`);
  console.log(`║  Date:    ${data.submittedAt}`);
  console.log('║──────────────────────────────────────────────────║');
  console.log(
    `║  Message: ${data.message.slice(0, 60)}${data.message.length > 60 ? '…' : ''}`
  );
  console.log('╚══════════════════════════════════════════════════╝\n');
  /* eslint-enable no-console */
  return { isSuccess: true, messageId: `mock-${Date.now()}` };
}

/** Send a contact form email using the configured provider. */
export async function sendContactEmail(
  data: ContactMessage
): Promise<SendResult> {
  const provider = getProvider();
  switch (provider) {
    case 'resend':
      return sendViaResend(data);
    case 'sendgrid':
      return sendViaSendGrid(data);
    default:
      return sendViaConsole(data);
  }
}
