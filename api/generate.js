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

    // STEP 1: Translate prompt ke Inggris
    let translatedPrompt = prompt;
    try {
      const translateRes = await fetch("https://de.libretranslate.com/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: prompt,
          source: "id",
          target: "en",
          format: "text",
          api_key: ""
        }),
      });

      if (!translateRes.ok) throw new Error("Failed to translate text");
      const data = await translateRes.json();
      translatedPrompt = data.translatedText || prompt;
    } catch (err) {
      console.error("Translate error:", err);
      // fallback ke prompt asli kalau translate gagal
      translatedPrompt = prompt;
    }

    // STEP 2: Kirim prompt (sudah diterjemahkan) ke Siputzx
    const targetUrl = `https://api.siputzx.my.id/api/ai/${model}?prompt=${encodeURIComponent(translatedPrompt)}`;
    const resp = await fetch(targetUrl);

    if (!resp.ok) {
      const text = await resp.text();
      return new Response(
        JSON.stringify({ error: "Failed to fetch image", details: text }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // STEP 3: Forward hasil gambar langsung
    return new Response(resp.body, {
      status: 200,
      headers: {
        "Content-Type": resp.headers.get("Content-Type") || "image/png",
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
