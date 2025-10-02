// Generate background stars dynamically
const starsContainer = document.querySelector(".stars");
const numStars = 120;

for (let i = 0; i < numStars; i++) {
  const star = document.createElement("div");
  star.classList.add("star");

  // random size
  const size = Math.random() * 3 + 1;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;

  // random position
  star.style.top = `${Math.random() * 100}%`;
  star.style.left = `${Math.random() * 100}%`;

  // random animation delay & duration
  star.style.animationDelay = `${Math.random() * 5}s`;
  star.style.animationDuration = `${2 + Math.random() * 3}s`;

  starsContainer.appendChild(star);
}

// AI Image Generator
async function generate() {
  const prompt = document.getElementById("prompt").value.trim();
  const model = document.getElementById("model").value;
  const resultDiv = document.getElementById("result");

  if (!prompt) {
    resultDiv.innerHTML = "<div>⚠️ Prompt tidak boleh kosong.</div>";
    return;
  }

  resultDiv.innerHTML = "<div>⏳ Generating image... Tunggu sebentar.</div>";

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt })
    });

    if (!res.ok) {
      resultDiv.innerHTML = "<div>❌ Error generating image. Coba lagi.</div>";
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    resultDiv.innerHTML = `
      <img src="${url}" alt="Generated Image" />
      <br>
      <a href="${url}" download="ai-image.png" class="download-btn">⬇ Download Gambar</a>
    `;
  } catch (err) {
    resultDiv.innerHTML = "<div>❌ Error: " + err.message + "</div>";
  }
}