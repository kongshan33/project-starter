import { isPreview } from "@starter/types";

export async function POST(request: Request): Promise<Response> {
  let payload: unknown;
  try { payload = await request.json(); }
  catch { return Response.json({ error: "Invalid JSON." }, { status: 400 }); }
  if (!payload || typeof payload !== "object" || !("title" in payload)
    || typeof payload.title !== "string" || !payload.title.trim() || payload.title.length > 120) {
    return Response.json({ error: "Provide a title of 1–120 characters." }, { status: 422 });
  }
  try {
    const origin = process.env.API_INTERNAL_URL ?? "http://127.0.0.1:8000";
    const upstream = await fetch(new URL("/api/preview", origin), {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: payload.title }), cache: "no-store", signal: AbortSignal.timeout(5000),
    });
    if (!upstream.ok) return Response.json({ error: "Preview unavailable." }, { status: upstream.status === 422 ? 422 : 502 });
    const value: unknown = await upstream.json();
    if (!isPreview(value)) return Response.json({ error: "Invalid preview response." }, { status: 502 });
    return Response.json(value, { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ error: "Preview service unavailable." }, { status: 503 }); }
}
