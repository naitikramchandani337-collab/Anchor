import type { Task } from '../lib/types';

interface Props {
  tasks: Task[];
}

export default function ProgressTracker({ tasks }: Props) {
  const totalCount = tasks.length;
  const doneCount = tasks.filter((t) => t.done).length;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  let message: string | null = null;
  if (doneCount > 0 && doneCount < totalCount) {
    message = "You're making progress. Take it one step at a time.";
  } else if (totalCount > 0 && doneCount === totalCount) {
    message = "You've completed everything. That took real strength.";
  }

  return (
    <div className="rounded-[1.5rem] border border-white/70 bg-white/60 p-6 backdrop-blur-md glow-ring">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-deep">
          {doneCount} of {totalCount} tasks complete
        </span>
        <span className="text-sm font-medium text-clay">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-sand">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-glow to-clay transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      {message && (
        <p className={`mt-3 text-sm italic text-ink/70 ${doneCount === totalCount ? 'text-moss' : ''}`}>
          &ldquo;{message}&rdquo;
        </p>
      )}
    </div>
  );
}
