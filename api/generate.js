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

    // Step 1: translate prompt
    const translateRes = await fetch(`${req.url.replace("/generate", "/translate")}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: prompt })
    });

    if (!translateRes.ok) {
      const text = await translateRes.text();
      return new Response(
        JSON.stringify({ error: "Failed to translate prompt", details: text }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const { translatedText } = await translateRes.json();

    // Step 2: call Siputzx API
    const targetUrl = `https://api.siputzx.my.id/api/ai/${model}?prompt=${encodeURIComponent(translatedText)}`;
    const resp = await fetch(targetUrl);

    if (!resp.ok) {
      const text = await resp.text();
      return new Response(
        JSON.stringify({ error: "Failed to fetch image", details: text }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // forward image
    return new Response(resp.body, {
      status: 200,
      headers: {
        "Content-Type": resp.headers.get("Content-Type") || "image/png",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
