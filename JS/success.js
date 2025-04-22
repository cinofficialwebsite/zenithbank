document.addEventListener("DOMContentLoaded", async function () {
  AOS.init();

  // Retrieve user data from localStorage
  const storedData = localStorage.getItem("personalInfo");
  const userData = storedData ? JSON.parse(storedData) : {};

  document.getElementById("userName").textContent =
    userData.firstName || "User";

  // Retrieve stored user ID (must be set in localStorage earlier)
  const userId = localStorage.getItem("userId");
  if (!userId) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "User ID not found. Please restart the registration process.",
    });
    return;
  }

  // Check if the user already has an account number
  let accountNumber = userData.accountNumber;

  if (!accountNumber) {
    // Account number is not assigned, so we need to generate one
    accountNumber = Math.floor(
      1000000000 + Math.random() * 9000000000
    ).toString();

    // Update the user data with the newly generated account number
    userData.accountNumber = accountNumber;

    // Save the updated user data back to localStorage
    localStorage.setItem("personalInfo", JSON.stringify(userData));

    // Alert the user that a new account number has been generated
    Swal.fire({
      icon: "info",
      title: "Account Number Assigned",
      text: `A new account number has been generated for you: ${accountNumber}`,
    });
  } else {
    // Account number exists, show it to the user
    Swal.fire({
      icon: "info",
      title: "Account Already Exists",
      text: `Your account number is: ${accountNumber}`,
    });
  }

  // Display the account number
  document.getElementById("accountNumber").textContent = accountNumber;

  // Send final data to the backend to complete registration
  try {
    const personalInfo = {
      ...userData,
      accountNumber,
    };

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
      Swal.fire({
        icon: "success",
        title: "Registration Completed!",
        text: "Your account has been successfully created.",
        timer: 3000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.error || "Failed to finalize registration.",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Network Error",
      text: "Failed to connect to the server. Please check your internet and try again.",
    });
  }
});

// Copy function
function copyAccountNumber() {
  const accountNumber = document.getElementById("accountNumber").textContent;
  navigator.clipboard.writeText(accountNumber);

  Swal.fire({
    icon: "success",
    title: "Copied!",
    text: "Account number copied to clipboard.",
    timer: 1500,
    showConfirmButton: false,
  });
}
