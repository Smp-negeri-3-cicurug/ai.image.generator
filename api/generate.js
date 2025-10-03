export const config = { runtime: "edge" };

export default async function handler(req) {
  try {
    const { model, prompt } = await req.json();
    if (!model || !prompt) {
      return new Response(JSON.stringify({ error: "Model & prompt required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const targetUrl = `https://api.siputzx.my.id/api/ai/${model}?prompt=${encodeURIComponent(prompt)}`;
    const resp = await fetch(targetUrl);

    if (!resp.ok) {
      const text = await resp.text();
      return new Response(JSON.stringify({ error: "Failed to fetch image", details: text }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    return new Response(resp.body, {
      status: 200,
      headers: { "Content-Type": resp.headers.get("Content-Type") || "image/png", "Access-Control-Allow-Origin": "*" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
  }
