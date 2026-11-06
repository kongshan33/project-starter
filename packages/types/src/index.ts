/** Mirrors apps/api/app/schemas/preview.py. Both sides check the shared fixture. */
export type Preview = { title: string; word_count: number; character_count: number };

export function isPreview(value: unknown): value is Preview {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return typeof record.title === "string" && record.title.length > 0
    && Number.isInteger(record.word_count) && Number(record.word_count) >= 0
    && Number.isInteger(record.character_count) && Number(record.character_count) >= 0;
}
