export const config = { runtime: "edge" };

export default async function handler(req) {
  try {
    const { text } = await req.json();
    if (!text) {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const res = await fetch("https://de.libretranslate.com/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "id",
        target: "en",
        format: "text",
        api_key: ""
      })
    });

    if (!res.ok) throw new Error("Failed to translate text");

    const data = await res.json();

    return new Response(
      JSON.stringify({ translatedText: data.translatedText || text }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  }
