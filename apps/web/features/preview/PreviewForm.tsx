"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { normalizeTitle } from "@starter/core";
import { isPreview, type Preview } from "@starter/types";
import { Button } from "@starter/ui/button";
import { Input } from "@starter/ui/field";

export function PreviewForm() {
  const [title, setTitle] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Preview | null>(null);
  const active = useRef<AbortController | null>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => () => active.current?.abort(), []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (active.current) return;
    const normalized = normalizeTitle(title);
    if (!normalized) { setError("Enter a title to continue."); input.current?.focus(); return; }
    const controller = new AbortController();
    active.current = controller;
    setPending(true); setError("");
    try {
      const response = await fetch("/api/preview", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: normalized }), signal: controller.signal });
      if (!response.ok) throw new Error("We couldn’t create your preview. Your title is still here; please try again.");
      const value: unknown = await response.json();
      if (!isPreview(value)) throw new Error("The preview could not be read. Please try again.");
      if (active.current === controller) setResult(value);
    } catch (cause) {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Please try again.");
    } finally {
      if (active.current === controller) { active.current = null; setPending(false); }
    }
  }
  return <form action="/api/preview" method="post" onSubmit={submit}>
    <label htmlFor="idea-title">Idea title <span className="muted">(required)</span></label>
    <p className="field-hint" id="title-hint">Up to 120 characters.</p>
    <Input ref={input} id="idea-title" name="title" required maxLength={120} value={title}
      readOnly={pending} aria-describedby={`title-hint${error ? " preview-error" : ""}`}
      onChange={event => { setTitle(event.target.value); setError(""); }} placeholder="A small idea with a useful outcome" />
    <div className="form-action"><Button type="submit" variant="primary" loading={pending} loadingLabel="Creating…">Create preview</Button></div>
    <p id="preview-error" className="error-message" role="alert">{error}</p>
    <div className="preview-result" aria-live="polite" aria-atomic="true" aria-busy={pending}>
      {result ? <><p className="eyebrow">Your preview</p><h3>{result.title}</h3>
        <p className="muted">{result.word_count} words · {result.character_count} characters</p></>
        : <p className="muted">Your preview will appear here.</p>}
    </div>
    <noscript>This interactive preview requires JavaScript.</noscript>
  </form>;
}
