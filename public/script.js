// Generate background stars dynamically
const starsContainer = document.querySelector(".stars");
const numStars = 120;

for (let i = 0; i < numStars; i++) {
  const star = document.createElement("div");
  star.classList.add("star");

  const size = Math.random() * 3 + 1;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;

  star.style.top = `${Math.random() * 100}%`;
  star.style.left = `${Math.random() * 100}%`;

  star.style.animationDelay = `${Math.random() * 5}s`;
  star.style.animationDuration = `${2 + Math.random() * 3}s`;

  starsContainer.appendChild(star);
}

// Spinner helper
function showSpinner(target, text = "Loading...") {
  target.innerHTML = `
    <div class="spinner"></div>
    <p>${text}</p>
  `;
}

function hideSpinner(target) {
  target.innerHTML = "";
}

// Translate via Lingva
async function translateToEnglish(text) {
  try {
    const res = await fetch(
      "https://lingva.ml/api/v1/id/en/" + encodeURIComponent(text)
    );
    if (!res.ok) throw new Error("Failed to translate text");
    const data = await res.json();
    return data.translation || text;
  } catch (err) {
    console.error("Translate Error:", err);
    return text; // fallback
  }
}

// Generate AI Image
async function generate() {
  const promptInput = document.getElementById("prompt");
  const modelSelect = document.getElementById("model");
  const resultDiv = document.getElementById("result");

  const prompt = promptInput.value.trim();
  const model = modelSelect.value;

  if (!prompt) {
    resultDiv.innerHTML = "<div>Prompt tidak boleh kosong.</div>";
    return;
  }

  // Spinner saat translate
  showSpinner(resultDiv, "Translating prompt...");

  const translated = await translateToEnglish(prompt);

  // Spinner saat generate
  showSpinner(resultDiv, "Generating image...");

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt: translated }),
    });

    if (!res.ok) {
      const text = await res.text();
      resultDiv.innerHTML = `
        <div>Error generating image</div>
        <div>Status: ${res.status} ${res.statusText}</div>
        <div>Response: ${text}</div>
      `;
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    resultDiv.innerHTML = `
      <img src="${url}" alt="Generated Image" />
      <br>
      <a href="${url}" download="ai-image.png" class="download-btn">Download Gambar</a>
      <button onclick="resetApp()" class="reset-btn">Reset</button>
    `;

    resultDiv.scrollIntoView({ behavior: "smooth" });
  } catch (err) {
    resultDiv.innerHTML = `
      <div>Terjadi error saat fetch API</div>
      <div>Message: ${err.message}</div>
    `;
  }
}

// Reset app
function resetApp() {
  document.getElementById("prompt").value = "";
  document.getElementById("result").innerHTML = "";
}
