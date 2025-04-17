(function () {
  const accountNumber = localStorage.getItem("currentAccount");

  if (!accountNumber) {
    alert("No account number found. Please log in.");
    window.location.href = "login.html";
  } else {
    fetchUserSettings(accountNumber);
  }
})();

function fetchUserSettings(accountNumber) {
  fetch(
    `https://zenithbank-backend.onrender.com/api/users/account/${accountNumber}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error fetching user settings: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.accountNumber) {
        document.getElementById(
          "setting-full-name"
        ).textContent = `${data.firstName} ${data.middleName} ${data.lastName}`;
        document.getElementById("setting-username").textContent =
          data.firstName;
        document.getElementById("setting-account").textContent =
          data.accountNumber;
        document.getElementById("setting-phone").textContent = data.phoneNumber;
        document.getElementById("setting-balance").textContent = formatAmount(
          data.accountBalance
        );
      } else {
        alert("User settings not found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching user settings:", error);
      alert(
        "An error occurred while fetching your settings. Please try again later."
      );
    });
}

function formatAmount(amount) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
