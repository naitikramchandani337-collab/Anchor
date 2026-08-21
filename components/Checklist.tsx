'use client';

import type { Task } from '../lib/types';
import ProgressTracker from './ProgressTracker';

interface Props {
  tasks: Task[];
  onSelectTask: (id: string) => void;
  onToggleTask: (id: string) => void;
  onStartOver: () => void;
}

interface TaskCardProps {
  task: Task;
  onSelect: () => void;
  onToggle: () => void;
}

function TaskCard({ task, onSelect, onToggle }: TaskCardProps) {
  const isUrgent = task.urgency === 'urgent';

  return (
    <div className={`rounded-[1.75rem] border bg-white/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/80 hover:shadow-xl hover:shadow-clay/10 ${task.done ? 'border-sand opacity-70' : 'border-white/70'}`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={onToggle}
            aria-label={task.done ? `Mark "${task.title}" as pending` : `Mark "${task.title}" as done`}
            className={`shrink-0 h-6 w-6 rounded-full border-2 transition-all cursor-pointer ${
              task.done
                ? 'border-moss bg-moss/20 text-moss'
                : 'border-clay/40 hover:border-clay'
            }`}
          >
            {task.done && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-full w-full p-0.5">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <h3 className={`font-serif text-lg font-medium text-deep leading-snug ${task.done ? 'line-through text-ink/50' : ''}`}>
            {task.title}
          </h3>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wide ${
          isUrgent
            ? 'bg-clay/10 text-clay'
            : 'bg-moss/10 text-moss'
        }`}>
          {isUrgent ? 'Urgent' : 'Can wait'}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-ink/70 ml-9 mb-4">{task.description}</p>
      <div className="ml-9">
        <button
          onClick={onSelect}
          className="text-sm font-medium text-clay hover:text-[#b97a59] transition-colors cursor-pointer underline underline-offset-4 decoration-clay/40"
        >
          View / Edit Draft →
        </button>
      </div>
    </div>
  );
}

export default function Checklist({ tasks, onSelectTask, onToggleTask, onStartOver }: Props) {
  const sorted = [
    ...tasks.filter((t) => t.urgency === 'urgent'),
    ...tasks.filter((t) => t.urgency === 'can wait'),
  ];

  return (
    <div className="rise">
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-clay">Your gentle agenda</p>
        <h1 className="font-serif text-3xl font-light leading-snug text-deep sm:text-4xl">
          Here&apos;s what comes next.
        </h1>
        <p className="mt-3 text-base text-ink/70 leading-relaxed">
          Take your time. There&apos;s no rush — work through these at your own pace.
        </p>
      </div>

      <ProgressTracker tasks={tasks} />

      <ul className="mt-6 space-y-4" role="list">
        {sorted.map((task) => (
          <li key={task.id}>
            <TaskCard
              task={task}
              onSelect={() => onSelectTask(task.id)}
              onToggle={() => onToggleTask(task.id)}
            />
          </li>
        ))}
      </ul>

      <button
        className="mt-8 text-sm text-ink/50 hover:text-clay transition-colors cursor-pointer"
        onClick={onStartOver}
      >
        ← Start over
      </button>
    </div>
  );
}
