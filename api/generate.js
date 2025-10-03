export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const { model, prompt } = await req.json();

    if (!model || !prompt) {
      return new Response(
        JSON.stringify({ error: "Model & prompt required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Translate prompt ID -> EN
    let translatedPrompt;
    try {
      const translateRes = await fetch("https://de.libretranslate.com/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: prompt,
          source: "id",
          target: "en",
          format: "text",
          alternatives: 3,
          api_key: ""
        }),
      });
      const translateData = await translateRes.json();
      translatedPrompt = translateData.translatedText || translateData.alternatives[0] || prompt;
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Failed to translate prompt" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Panggil API siputzx
    const targetUrl = `https://api.siputzx.my.id/api/ai/${model}?prompt=${encodeURIComponent(translatedPrompt)}`;
    const resp = await fetch(targetUrl);

    const contentType = resp.headers.get("Content-Type") || "";
    if (!resp.ok) {
      const text = await resp.text();
      return new Response(
        JSON.stringify({ error: "Failed to fetch image", status: resp.status, body: text }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!contentType.includes("image/png")) {
      const text = await resp.text();
      return new Response(
        JSON.stringify({ error: "API response is not PNG", body: text }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Forward PNG ke frontend
    return new Response(resp.body, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
          }
