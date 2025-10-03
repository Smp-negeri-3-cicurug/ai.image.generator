import { translateToEnglish } from "./translate";

export const config = { runtime: "edge" };

export default async function handler(req) {
  try {
    const { model, prompt } = await req.json();

    if (!model || !prompt) {
      return new Response(
        JSON.stringify({ error: "Model & prompt required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Translate prompt dulu ke bahasa Inggris
    const promptEn = await translateToEnglish(prompt);

    // Panggil API Siputzx
    const targetUrl = `https://api.siputzx.my.id/api/ai/${model}?prompt=${encodeURIComponent(promptEn)}`;
    const resp = await fetch(targetUrl);

    if (!resp.ok) {
      const text = await resp.text();
      return new Response(
        JSON.stringify({ error: "Failed to fetch image", status: resp.status, response: text }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Forward gambar langsung (PNG)
    return new Response(resp.body, {
      status: 200,
      headers: {
        "Content-Type": resp.headers.get("Content-Type") || "image/png",
        "Access-Control-Allow-Origin": "*",
      },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Server error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
