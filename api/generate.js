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

    // Pilih endpoint sesuai model
    let apiUrl = "";
    if (model === "magicstudio") {
      apiUrl = `https://api.siputzx.my.id/api/ai/magicstudio?prompt=${encodeURIComponent(prompt)}`;
    } else if (model === "flux") {
      apiUrl = `https://api.siputzx.my.id/api/ai/flux?prompt=${encodeURIComponent(prompt)}`;
    } else {
      return new Response(
        JSON.stringify({ error: "Model tidak valid" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const resp = await fetch(apiUrl);
    if (!resp.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch image", status: resp.status }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return image langsung
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
