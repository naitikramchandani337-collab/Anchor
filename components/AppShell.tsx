'use client';

import { useState } from 'react';
import type { Task } from '../lib/types';
import LandingPage from './LandingPage';
import SituationInput from './SituationInput';
import Checklist from './Checklist';
import TaskDetail from './TaskDetail';
import AnchorGlyph from './AnchorGlyph';

type View = 'landing' | 'input' | 'checklist' | 'task';

export default function AppShell() {
  const [view, setView] = useState<View>('landing');
  const [situationInput, setSituationInput] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  async function handleSubmitSituation(input: string) {
    const res = await fetch('/api/generate-checklist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userInput: input }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to generate checklist');
    }

    const data = await res.json();
    const tasksWithMeta: Task[] = data.tasks.map(
      (t: Omit<Task, 'id' | 'done'>) => ({
        ...t,
        id: crypto.randomUUID(),
        done: false,
      })
    );

    setSituationInput(input);
    setTasks(tasksWithMeta);
    setView('checklist');
  }

  function handleSelectTask(taskId: string) {
    setSelectedTaskId(taskId);
    setView('task');
  }

  function handleToggleTask(taskId: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
    );
  }

  function handleEditDraft(taskId: string, text: string) {
    setDrafts((prev) => ({ ...prev, [taskId]: text }));
  }

  function handleDraftGenerated(taskId: string, text: string) {
    setDrafts((prev) => ({ ...prev, [taskId]: text }));
  }

  function handleBackToChecklist() {
    setView('checklist');
  }

  function handleStartOver() {
    setView('input');
    setSituationInput('');
    setTasks([]);
    setSelectedTaskId(null);
    setDrafts({});
  }

  function handleGetStarted() {
    setView('input');
    setTimeout(() => {
      document.getElementById('app-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;

  // Landing page — full page marketing view
  if (view === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  // App views — situated below a minimal nav
  return (
    <div className="relative min-h-screen">
      <div className="bg-blobs" />
      <div className="grain" />

      {/* Minimal nav bar */}
      <nav className="sticky top-0 z-50 border-b border-clay/10 bg-cream/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <button
            onClick={() => setView('landing')}
            className="flex items-center gap-2.5 text-clay cursor-pointer"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/80 glow-ring">
              <AnchorGlyph className="h-4 w-4" />
            </span>
            <span className="font-serif text-lg font-medium text-deep">Anchor</span>
          </button>
          {(view === 'checklist' || view === 'task') && (
            <button
              onClick={handleStartOver}
              className="text-sm text-ink/60 hover:text-clay transition-colors cursor-pointer"
            >
              Start over
            </button>
          )}
        </div>
      </nav>

      <div id="app-section" className="mx-auto max-w-3xl px-6 py-12">
        {view === 'input' && (
          <div className="view-wrapper visible">
            <SituationInput onSubmit={handleSubmitSituation} />
          </div>
        )}
        {view === 'checklist' && (
          <div className="view-wrapper visible">
            <Checklist
              tasks={tasks}
              onSelectTask={handleSelectTask}
              onToggleTask={handleToggleTask}
              onStartOver={handleStartOver}
            />
          </div>
        )}
        {view === 'task' && selectedTask && (
          <div className="view-wrapper visible">
            <TaskDetail
              task={selectedTask}
              situationInput={situationInput}
              draft={drafts[selectedTask.id]}
              onDraftGenerated={handleDraftGenerated}
              onEditDraft={handleEditDraft}
              onBack={handleBackToChecklist}
            />
          </div>
        )}
      </div>
    </div>
  );
}
