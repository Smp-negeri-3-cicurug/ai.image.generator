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

    // URL API siputzx
    const url = `https://api.siputzx.my.id/api/ai/${model}?prompt=${encodeURIComponent(prompt)}`;

    // Fetch binary image langsung
    const resp = await fetch(url);
    if (!resp.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch image from API", status: resp.status }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const arrayBuffer = await resp.arrayBuffer(); // ambil sebagai binary
    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message, status: 500 }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
