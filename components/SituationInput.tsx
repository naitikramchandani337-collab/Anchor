'use client';

import { useState } from 'react';
import AnchorGlyph from './AnchorGlyph';

interface Props {
  onSubmit: (input: string) => Promise<void>;
}

export default function SituationInput({ onSubmit }: Props) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [apiError, setApiError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError('');

    if (!input.trim()) {
      setValidationError('Please describe your situation before continuing.');
      return;
    }

    setValidationError('');
    setIsLoading(true);

    try {
      await onSubmit(input.trim());
    } catch (err) {
      setApiError('Error: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rise">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-white/80 glow-ring">
          <AnchorGlyph className="h-7 w-7 text-clay" />
        </div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-clay">
          A calm companion for hard days
        </p>
        <h1 className="font-serif text-3xl font-light leading-snug text-deep sm:text-4xl">
          Tell me what happened.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink/70 max-w-lg mx-auto">
          No forms, no jargon. Just describe your situation in your own words — the way you&apos;d tell a friend.
          Anchor will take it from there.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="rounded-[2rem] border border-white/70 bg-white/60 p-8 backdrop-blur-md glow-ring">
        <label htmlFor="situation" className="block text-sm font-medium text-deep mb-3">
          Your situation
        </label>
        <textarea
          id="situation"
          className="situation-textarea"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (validationError) setValidationError('');
          }}
          placeholder="For example: My father passed away last week. He lived alone and had a bank account, a car, and some subscriptions I need to cancel..."
          rows={6}
          disabled={isLoading}
          aria-describedby={validationError ? 'situation-error' : undefined}
          aria-invalid={!!validationError}
        />

        {validationError && (
          <p id="situation-error" className="field-error mt-2" role="alert">
            {validationError}
          </p>
        )}

        {apiError && (
          <p className="api-error mt-3" role="alert">
            {apiError}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-xs text-ink/50">Your words stay in this session only — nothing is saved.</p>
          <button type="submit" className="btn-primary shrink-0" disabled={isLoading}>
            {isLoading ? (
              <span className="loading-text">
                <span className="spinner" aria-hidden="true" />
                Building your checklist…
              </span>
            ) : (
              'Get my checklist →'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
