import { prisma } from "@getitdone/db";
import { NextRequest } from "next/server";

export async function GET() {
  const items = await prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
  return Response.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.title || body.title.length < 3) return new Response('Invalid title', { status: 400 });
  const task = await prisma.task.create({ data: { title: body.title, notes: body.notes ?? null, userId: (await prisma.user.findFirst())!.id } });
  return Response.json(task, { status: 201 });
}
