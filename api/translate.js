// translate.js
export async function translateToEnglish(text) {
  try {
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
    return data.translatedText || text;
  } catch (err) {
    console.error("Translate Error:", err);
    return text; // fallback ke text asli kalau gagal
  }
}
