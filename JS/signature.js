AOS.init();

const signatureCanvas = document.getElementById("signatureCanvas");
const clearSignature = document.getElementById("clearSignature");
const proceedToPersonalInfo = document.getElementById("proceedToPersonalInfo");
const loadingOverlay = document.getElementById("loadingOverlay");

const ctx = signatureCanvas.getContext("2d");
let isDrawing = false;

// Make canvas responsive
function resizeCanvas() {
  signatureCanvas.width = signatureCanvas.offsetWidth;
  signatureCanvas.height = 150; // Maintain a good height for signing
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Configure brush
ctx.lineWidth = 2;
ctx.lineJoin = "round";
ctx.lineCap = "round";
ctx.strokeStyle = "black";

// Start drawing immediately on touch/mouse down
function startDrawing(event) {
  isDrawing = true;
  ctx.beginPath();
  draw(event);
}

// Draw continuously while moving
function draw(event) {
  if (!isDrawing) return;

  const rect = signatureCanvas.getBoundingClientRect();
  const x = event.clientX
    ? event.clientX - rect.left
    : event.touches[0].clientX - rect.left;
  const y = event.clientY
    ? event.clientY - rect.top
    : event.touches[0].clientY - rect.top;

  ctx.lineTo(x, y);
  ctx.stroke();
}

// Stop drawing & save signature
function stopDrawing() {
  isDrawing = false;
  checkSignature();
}

// Event listeners for both mouse and touch
signatureCanvas.addEventListener("pointerdown", startDrawing);
signatureCanvas.addEventListener("pointermove", draw);
signatureCanvas.addEventListener("pointerup", stopDrawing);
signatureCanvas.addEventListener("pointerleave", stopDrawing);

// Clear Signature
clearSignature.addEventListener("click", () => {
  ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
  localStorage.removeItem("signature");
  proceedToPersonalInfo.disabled = true;
});

// Save Signature & Enable Proceed Button
function checkSignature() {
  const imageData = signatureCanvas.toDataURL();
  localStorage.setItem("signature", imageData);
  proceedToPersonalInfo.disabled = false;
}

// Proceed to Personal Info
proceedToPersonalInfo.addEventListener("click", () => {
  loadingOverlay.style.display = "flex";

  setTimeout(() => {
    window.location.href = "/HTML/personal-info.html";
  }, 3000); // Redirect after 5 seconds
});
