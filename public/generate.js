export const config = {
  runtime: "edge", // biar cepat
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

    // target API siputzx
    const targetUrl = `https://api.siputzx.my.id/api/ai/${model}?prompt=${encodeURIComponent(prompt)}`;
    const resp = await fetch(targetUrl);

    if (!resp.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch image" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // forward gambar langsung
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
