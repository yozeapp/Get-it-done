import { prisma } from "@getitdone/db";
import { NextRequest } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string }}) {
  const t = await prisma.task.findUnique({ where: { id: params.id }, include: { rules: true } });
  if (!t) return new Response('Not found', { status: 404 });
  return Response.json(t);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string }}) {
  const body = await req.json();
  const t = await prisma.task.update({ where: { id: params.id }, data: body });
  return Response.json(t);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string }}) {
  await prisma.task.update({ where: { id: params.id }, data: { archivedAt: new Date() } });
  return new Response(null, { status: 204 });
}
