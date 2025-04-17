document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password");
  const passwordError = document.getElementById("passwordError");
  const passwordCorrect = document.getElementById("passwordCorrect");
  const proceedBtn = document.getElementById("proceedBtn");

  // Get stored account number from localStorage
  const storedAccount = localStorage.getItem("currentAccount");

  if (!storedAccount) {
    alert("No account found. Please log in again.");
    window.location.href = "/HTML/login.html";
    return;
  }

  passwordInput.addEventListener("input", async function () {
    const enteredPassword = passwordInput.value.trim();

    try {
      const response = await fetch(
        "https://zenithbank-backend.onrender.com/api/users/verify-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accountNumber: storedAccount,
            password: enteredPassword,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        passwordCorrect.classList.remove("hidden");
        passwordError.classList.add("hidden");
        proceedBtn.disabled = false;
      } else {
        passwordError.classList.remove("hidden");
        passwordCorrect.classList.add("hidden");
        proceedBtn.disabled = true;
      }
    } catch (error) {
      passwordError.classList.remove("hidden");
      passwordError.textContent = "Server error. Please try again.";
    }
  });

  document
    .getElementById("passwordForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const loadingOverlay = document.getElementById("loadingOverlay");
      loadingOverlay.style.display = "flex";

      generateToken(); // ✅ Set token before redirecting

      setTimeout(() => {
        window.location.href = "/HTML/dashboard.html";
      }, 5000); // Show loading overlay for 3s
    });
});

function goBack() {
  window.history.back();
}

const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", () => {
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  togglePassword.classList.toggle("fa-eye");
  togglePassword.classList.toggle("fa-eye-slash");
});

function generateToken() {
  const token = Math.random().toString(36).substr(2) + Date.now().toString(36);
  const expiry = Date.now() + 5 * 60 * 60 * 1000; // 5 hours from now

  const tokenObject = {
    value: token,
    expiry,
  };

  localStorage.setItem("authToken", JSON.stringify(tokenObject));
}

function isTokenValid() {
  const tokenData = JSON.parse(localStorage.getItem("authToken") || "null");

  if (!tokenData || !tokenData.value || Date.now() > tokenData.expiry) {
    return false;
  }
  return true;
}
