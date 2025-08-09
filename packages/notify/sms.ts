import twilio from 'twilio';
import { Vonage } from '@vonage/server-sdk';

const tw = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;
const von = (process.env.VONAGE_API_KEY && process.env.VONAGE_API_SECRET)
  ? new Vonage({ apiKey: process.env.VONAGE_API_KEY!, apiSecret: process.env.VONAGE_API_SECRET! })
  : null;

export async function sendSMS(to: string, body: string) {
  try {
    if (!tw) throw new Error('twilio not configured');
    const res = await tw.messages.create({
      to,
      body,
      messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID
    });
    return { provider: 'twilio', id: res.sid };
  } catch (e) {
    if (!von) throw e;
    const res = await von.sms.send({to, from: 'GetITDone', text: body});
    return { provider: 'vonage', id: (res as any).messages?.[0]?.['message-id'] ?? 'unknown' };
  }
}
