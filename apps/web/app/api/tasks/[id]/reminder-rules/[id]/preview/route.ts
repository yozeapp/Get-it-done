import { prisma } from "@getitdone/db";
import { previewOccurrences } from "@getitdone/core/rrule";

export async function POST(_: Request, { params }: { params: { id: string }}) {
  const rule = await prisma.reminderRule.findUnique({ where: { id: params.id }, include: { task: { include: { user: true }}} });
  if (!rule?.rrule) return new Response('No RRULE', { status: 400 });
  const next = previewOccurrences(rule.rrule, new Date(), 10);
  return Response.json(next);
}
