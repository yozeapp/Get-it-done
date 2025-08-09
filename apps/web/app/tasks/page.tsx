import { prisma } from "@getitdone/db";
import Link from "next/link";

export default async function Tasks() {
  const tasks = await prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Tasks</h1>
      <Link className="underline" href="/tasks/new">New Task</Link>
      <ul className="mt-4 space-y-2">
        {tasks.map(t => (
          <li key={t.id} className="rounded border p-3">
            <Link href={`/tasks/${t.id}`}>{t.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
