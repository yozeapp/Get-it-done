import { prisma } from '@getitdone/db';
import { rrulestr } from 'rrule';

export async function generateOccurrences(ruleId: string, count = 50) {
  const rule = await prisma.reminderRule.findUnique({ where: { id: ruleId }, include: { task: { include: { user: true } } } });
  if (!rule) return;
  if (rule.type === 'RECURRING' && rule.rrule) {
    const r = rrulestr(rule.rrule);
    const next = r.all((_, i) => i < count);
    const data = next.map(d => ({ ruleId, runAtUTC: d }));
    await prisma.reminderOccurrence.createMany({ data, skipDuplicates: true });
  }
}
