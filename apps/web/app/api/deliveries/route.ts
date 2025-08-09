import { prisma } from "@getitdone/db";
export async function GET() {
  const logs = await prisma.deliveryLog.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  return Response.json(logs);
}
