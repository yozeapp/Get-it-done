import { prisma } from "@getitdone/db";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string }}) {
  const body = await req.json();
  if (body.type === 'ONEOFF' && !body.rrule) return new Response('rrule required', { status: 400 });
  const rule = await prisma.reminderRule.create({
    data: {
      taskId: params.id,
      type: body.type,
      rrule: body.rrule,
      offsetMinutes: body.offsetMinutes ?? 0,
      channels: body.channels ?? ['EMAIL']
    }
  });
  return Response.json(rule, { status: 201 });
}
