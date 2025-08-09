import cron from 'node-cron';
import { DateTime } from 'luxon';
import { prisma } from '@getitdone/db';
import { inQuietHours, nextEndOfQuiet } from '@getitdone/core/time';
import { mailQueue, smsQueue, defaultJobOpts } from './queues';

async function enqueueDue() {
  const now = DateTime.utc();
  const in60 = now.plus({ seconds: 60 });
  const due = await prisma.reminderOccurrence.findMany({
    where: { status: 'SCHEDULED', runAtUTC: { gte: now.toJSDate(), lt: in60.toJSDate() } },
    include: { rule: { include: { task: { include: { user: true } } } } }
  });

  for (const occ of due) {
    const user = occ.rule.task.user;
    const local = DateTime.fromJSDate(occ.runAtUTC, { zone: user.timezone || 'UTC' });
    if (inQuietHours(local, user.quietHoursStart ?? null, user.quietHoursEnd ?? null)) {
      const newLocal = nextEndOfQuiet(local, user.quietHoursStart ?? null, user.quietHoursEnd ?? null);
      const newUTC = newLocal.setZone('UTC').toJSDate();
      await prisma.reminderOccurrence.update({ where: { id: occ.id }, data: { runAtUTC: newUTC } });
      continue;
    }

    await prisma.reminderOccurrence.update({ where: { id: occ.id }, data: { status: 'QUEUED' } });

    const channels = occ.rule.channels;
    if (channels.includes('EMAIL')) {
      await mailQueue.add('send', { occurrenceId: occ.id }, { ...defaultJobOpts, jobId: `occ:${occ.id}:email` });
    }
    if (channels.includes('SMS')) {
      await smsQueue.add('send', { occurrenceId: occ.id }, { ...defaultJobOpts, jobId: `occ:${occ.id}:sms` });
    }
  }
}

cron.schedule('* * * * *', () => enqueueDue().catch(console.error));

import './workers/mail';
import './workers/sms';

console.log('Worker started with cron * * * * *');
