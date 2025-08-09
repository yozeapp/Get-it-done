import { Resend } from 'resend';
import sgMail from '@sendgrid/mail';

const resend = new Resend(process.env.RESEND_API_KEY);
if (process.env.SENDGRID_API_KEY) sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendEmail(opts: { to: string; subject: string; html: string; text?: string; }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await resend.emails.send({ from: process.env.EMAIL_FROM || 'Get IT Done <noreply@getitdone.dev>', ...opts, signal: controller.signal as any });
    clearTimeout(timeout);
    return { provider: 'resend', id: (res as any)?.id ?? 'unknown' };
  } catch (e) {
    clearTimeout(timeout);
    if (!process.env.SENDGRID_API_KEY) throw e;
    const [resp] = await sgMail.send({ from: process.env.EMAIL_FROM || 'noreply@getitdone.dev', ...opts });
    return { provider: 'sendgrid', id: resp.headers['x-message-id'] || 'unknown' };
  }
}
