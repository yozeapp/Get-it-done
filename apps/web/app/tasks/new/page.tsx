'use client';
import { useState } from 'react';

export default function NewTask() {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');

  async function create() {
    await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, notes }) });
    location.href = '/tasks';
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-3">
      <h1 className="text-2xl font-semibold">New Task</h1>
      <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full border p-2" placeholder="Title"/>
      <textarea value={notes} onChange={e=>setNotes(e.target.value)} className="w-full border p-2" placeholder="Notes"/>
      <button onClick={create} className="rounded bg-black px-4 py-2 text-white">Create</button>
    </main>
  );
}
