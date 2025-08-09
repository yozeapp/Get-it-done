import { Worker } from 'bullmq';
import { connection } from '../queues';
import { prisma } from '@getitdone/db';
import { reminderSmsText } from '@getitdone/notify/templates';
import { sendSMS } from '@getitdone/notify/sms';

new Worker('sms', async job => {
  const { occurrenceId } = job.data as { occurrenceId: string };
  const occ = await prisma.reminderOccurrence.findUnique({
    where: { id: occurrenceId },
    include: { rule: { include: { task: { include: { user: true } } } } }
  });
  if (!occ) return;
  const { task, user } = occ.rule as any;
  if (!user.phoneE164 || !user.phoneVerified) return;
  const body = reminderSmsText(task.title);
  const res = await sendSMS(user.phoneE164, body);
  await prisma.deliveryLog.create({ data: { occurrenceId, channel: 'SMS', provider: res.provider, status: 'sent', responseMeta: { id: res.id } as any } });
  await prisma.reminderOccurrence.update({ where: { id: occurrenceId }, data: { status: 'SENT' } });
}, { connection });
