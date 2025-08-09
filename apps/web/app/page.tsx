import Link from 'next/link';
export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">Get IT Done</h1>
      <p className="mt-2">Create tasks. Set reminders. Get it done.</p>
      <div className="mt-6 flex gap-3">
        <Link className="underline" href="/tasks">Tasks</Link>
        <Link className="underline" href="/settings">Settings</Link>
      </div>
    </main>
  );
}
