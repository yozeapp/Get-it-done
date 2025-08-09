import { Worker } from 'bullmq';
import { connection } from '../queues';
import { prisma } from '@getitdone/db';
import { reminderEmailTemplate } from '@getitdone/notify/templates';
import { sendEmail } from '@getitdone/notify/email';

new Worker('mail', async job => {
  const { occurrenceId } = job.data as { occurrenceId: string };
  const occ = await prisma.reminderOccurrence.findUnique({
    where: { id: occurrenceId },
    include: { rule: { include: { task: { include: { user: true } } } } }
  });
  if (!occ) return;
  const { task, user } = occ.rule as any;
  const { subject, html } = reminderEmailTemplate({
    taskTitle: task.title,
    dueAt: task.dueAt?.toISOString(),
    manageUrl: `${process.env.APP_BASE_URL}/tasks/${task.id}`,
    unsubscribeUrl: `${process.env.APP_BASE_URL}/settings` // demo
  });
  const res = await sendEmail({ to: user.email, subject, html });
  await prisma.deliveryLog.create({ data: { occurrenceId, channel: 'EMAIL', provider: res.provider, status: 'sent', responseMeta: { id: res.id } as any } });
  await prisma.reminderOccurrence.update({ where: { id: occurrenceId }, data: { status: 'SENT' } });
}, { connection });
