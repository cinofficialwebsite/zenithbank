document
  .getElementById("accountNumber")
  .addEventListener("input", async function () {
    const accountNumber = this.value.trim();
    const loadingGif = document.getElementById("loadingGif");
    const checkMark = document.getElementById("checkMark");
    const errorText = document.getElementById("errorText");
    const continueBtn = document.getElementById("continueBtn");
    const userInfo = document.getElementById("userInfo");

    // Reset UI
    loadingGif.classList.remove("hidden");
    checkMark.classList.add("hidden");
    errorText.classList.add("hidden");
    userInfo.classList.add("hidden");

    if (accountNumber.length === 10) {
      try {
        const response = await fetch(
          `https://zenithbank-backend.onrender.com/api/users/account/${accountNumber}`
        );
        const result = await response.json();

        loadingGif.classList.add("hidden");

        if (response.ok) {
          checkMark.classList.remove("hidden");
          userInfo.classList.remove("hidden");
          userInfo.textContent = `${result.firstName} ${result.middleName} ${result.lastName}`;
          continueBtn.disabled = false;

          // Store account number in localStorage for the next step
          localStorage.setItem("currentAccount", accountNumber);
        } else {
          errorText.classList.remove("hidden");
        }
      } catch (error) {
        loadingGif.classList.add("hidden");
        errorText.classList.remove("hidden");
        errorText.textContent = "Network error. Please try again.";
      }
    }
  });

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const loadingOverlay = document.getElementById("loadingOverlay");
    loadingOverlay.style.display = "flex";

    setTimeout(() => {
      window.location.href = "/HTML/enter-password.html";
    }, 3000); // Wait 3 seconds before redirecting
  });
