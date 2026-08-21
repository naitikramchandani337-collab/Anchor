'use client';

import { useEffect, useRef, useState } from 'react';
import type { Task } from '../lib/types';

interface Props {
  task: Task;
  situationInput: string;
  draft: string | undefined;
  onDraftGenerated: (taskId: string, text: string) => void;
  onEditDraft: (taskId: string, text: string) => void;
  onBack: () => void;
}

export default function TaskDetail({
  task,
  situationInput,
  draft,
  onDraftGenerated,
  onEditDraft,
  onBack,
}: Props) {
  const [isLoading, setIsLoading] = useState(draft === undefined);
  const [apiError, setApiError] = useState('');
  const [copyConfirm, setCopyConfirm] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (draft !== undefined) return;

    let cancelled = false;

    async function generateDraft() {
      setIsLoading(true);
      setApiError('');
      try {
        const res = await fetch('/api/generate-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskTitle: task.title,
            taskDescription: task.description,
            userInput: situationInput,
          }),
        });

        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        if (!cancelled) onDraftGenerated(task.id, data.draft);
      } catch {
        if (!cancelled) setApiError('Something went wrong drafting this letter. Please try again.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    generateDraft();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.id]);

  async function handleCopy() {
    const text = draft ?? '';
    try {
      await navigator.clipboard.writeText(text);
      setCopyConfirm(true);
      setTimeout(() => setCopyConfirm(false), 2000);
    } catch {
      textareaRef.current?.select();
    }
  }

  function handleDownload() {
    const text = draft ?? '';
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${task.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleRetry() {
    setApiError('');
    setIsLoading(true);

    fetch('/api/generate-document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskTitle: task.title,
        taskDescription: task.description,
        userInput: situationInput,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then((data) => {
        onDraftGenerated(task.id, data.draft);
        setIsLoading(false);
      })
      .catch(() => {
        setApiError('Something went wrong drafting this letter. Please try again.');
        setIsLoading(false);
      });
  }

  return (
    <div className="rise">
      {/* Back */}
      <button
        className="mb-8 text-sm text-ink/50 hover:text-clay transition-colors cursor-pointer"
        onClick={onBack}
      >
        ← Back to checklist
      </button>

      {/* Task header */}
      <div className="mb-8">
        <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wide mb-3 ${
          task.urgency === 'urgent' ? 'bg-clay/10 text-clay' : 'bg-moss/10 text-moss'
        }`}>
          {task.urgency === 'urgent' ? 'Urgent' : 'Can wait'}
        </span>
        <h1 className="font-serif text-2xl font-light leading-snug text-deep sm:text-3xl">{task.title}</h1>
        <p className="mt-2 text-base text-ink/70 leading-relaxed">{task.description}</p>
      </div>

      {/* Draft section */}
      <div className="rounded-[2rem] border border-white/70 bg-white/60 p-8 backdrop-blur-md glow-ring">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-ink/50">
          Draft letter / email
        </p>

        {isLoading && (
          <div className="flex items-center gap-3 py-12 justify-center text-ink/60" role="status" aria-live="polite">
            <span className="spinner" aria-hidden="true" />
            <span className="text-sm">Drafting your letter…</span>
          </div>
        )}

        {apiError && !isLoading && (
          <div role="alert" className="py-4">
            <p className="api-error mb-4">{apiError}</p>
            <button className="btn-secondary" onClick={handleRetry}>Try again</button>
          </div>
        )}

        {!isLoading && !apiError && draft !== undefined && (
          <>
            <textarea
              ref={textareaRef}
              className="draft-textarea"
              value={draft}
              onChange={(e) => onEditDraft(task.id, e.target.value)}
              rows={14}
              aria-label="Draft letter or email — editable"
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="btn-secondary" onClick={handleCopy}>
                {copyConfirm ? '✓ Copied!' : 'Copy to clipboard'}
              </button>
              <button className="btn-secondary" onClick={handleDownload}>
                Download .txt
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
