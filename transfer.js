document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".transfer-form");

  const inputSelectors = [
    "#own input[name='accountNumberOwn']",
    "#zenith input[name='accountNumberZenith']",
    "#own input[name='amount']",
    "#zenith input[name='amount']",
    "#other input[name='otherAccount']",
    "#foreign input[name='accountNumberForeign']",
    "#beneficiary input[name='beneficiaryAccountNumber']",
  ];

  inputSelectors.forEach((selector) => {
    const input = document.querySelector(selector);
    if (input) {
      input.addEventListener("input", () => {
        let rawValue = input.value.replace(/\D/g, "");
        if (input.name.includes("amount")) {
          localStorage.setItem(input.name, rawValue);
          input.value = new Intl.NumberFormat().format(rawValue);
        } else {
          input.value = rawValue;
          localStorage.setItem(input.name, rawValue);
        }
      });
    }
  });

  // Pin inputs
  const pinInputs = document.querySelectorAll(".pin-input");
  pinInputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "");
      if (input.value && index < pinInputs.length - 1) {
        pinInputs[index + 1].focus();
      }
      const pin = Array.from(pinInputs)
        .map((i) => i.value)
        .join("");
      localStorage.setItem("transactionPin", pin); // Store the full PIN
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && index > 0) {
        pinInputs[index - 1].focus();
      }
    });
  });

  const pinOverlay = document.getElementById("pinOverlay");
  const submitPinBtn = document.getElementById("submitPin");
  const overlayBox = document.querySelector(".overlay-box");

  // Close overlay when clicking outside the white box
  pinOverlay.addEventListener("click", (event) => {
    if (!overlayBox.contains(event.target)) {
      pinOverlay.style.display = "none";
      clearPinInputs();
    }
  });

  pinInputs.forEach((input) => {
    input.addEventListener("input", () => {
      const pin = Array.from(pinInputs)
        .map((input) => input.value)
        .join("");

      if (pin.length === 6) {
        // Close the PIN overlay immediately
        pinOverlay.style.display = "none";

        // Show SweetAlert loading spinner for 5 seconds
        Swal.fire({
          title: "Verifying PIN...",
          text: "Please wait while we verify your PIN and process the transaction.",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        setTimeout(() => {
          const accountNumber = localStorage.getItem("currentAccount");

          if (accountNumber) {
            fetch(
              "https://zenithbank-backend.onrender.com/api/users/set-or-verify-pin",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  accountNumber: accountNumber,
                  transactionPin: pin,
                }),
              }
            )
              .then((res) => res.json())
              .then((data) => {
                if (data.message) {
                  // Proceed with balance deduction
                  const formId = pinOverlay.getAttribute("data-form-id");
                  const form = document.getElementById(formId);
                  if (!form) return;

                  const formData = new FormData(form);
                  const formValues = {};
                  formData.forEach((value, key) => {
                    const cleanValue = value.replace(/,/g, "");
                    formValues[key] = cleanValue;
                    localStorage.setItem(key, cleanValue);
                  });

                  const amount = parseFloat(formValues.amount || 0);
                  if (amount > 0) {
                    fetch(
                      `https://zenithbank-backend.onrender.com/api/users/update-balance/${accountNumber}`,
                      {
                        method: "PATCH",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ amount: amount }), // Use negative value to deduct
                      }
                    )
                      .then((res) => res.json())
                      .then((data) => {
                        if (data && data.accountBalance !== undefined) {
                          Swal.fire({
                            icon: "success",
                            title: "Transfer Successful!",
                            text: "Check transaction status.",
                          }).then(() => {
                            window.location.href = "dashboard.html";
                          });
                        } else {
                          Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "There was an error updating your balance.",
                          });
                        }
                      })
                      .catch((err) => {
                        Swal.fire({
                          icon: "error",
                          title: "Error",
                          text: "An error occurred while processing your transfer.",
                        });
                        console.error(err);
                      });
                  }
                } else if (data.error) {
                  Swal.fire({
                    icon: "error",
                    title: "PIN Verification Failed",
                    text: data.error,
                  });
                }
              })
              .catch((err) => {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: "There was an error verifying the transaction PIN.",
                });
                console.error(err);
              });
          }
        }, 5000); // Wait 5 seconds before processing
      }
    });
  });

  // Fetch user balance
  const accountNumber = localStorage.getItem("currentAccount");
  if (!accountNumber) return;

  fetch(
    `https://zenithbank-backend.onrender.com/api/users/account/${accountNumber}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data && data.accountBalance !== undefined) {
        const balance = parseFloat(data.accountBalance);
        localStorage.setItem("balance", balance);

        const formattedBalance = formatWithCommas(balance);
        const option = document.createElement("option");
        option.value = data.accountNumber;
        option.textContent = `Account No: ${data.accountNumber} - Balance $${formattedBalance}`;

        [
          "account-type-own",
          "account-type-zenith",
          "account-type-other",
          "account-type-foreign",
        ].forEach((id) => {
          const dropdown = document.getElementById(id);
          if (dropdown) {
            dropdown.innerHTML = "";
            dropdown.appendChild(option.cloneNode(true));
          }
        });

        forms.forEach((form) => {
          form.addEventListener("submit", (e) => {
            e.preventDefault();

            const accountNumberInput = form.querySelector(
              "input[name='accountNumberInputed']"
            );
            if (accountNumberInput && accountNumberInput.value.length !== 11) {
              Swal.fire({
                icon: "error",
                title: "Invalid Account Number",
                text: "Please enter a valid 11-digit account number.",
              });
              return;
            }

            const formData = new FormData(form);
            const values = {};
            formData.forEach((value, key) => {
              values[key] = value.replace(/,/g, "").trim();
            });

            const amount = parseFloat(
              values.amount || values["amount-input"] || 0
            );

            if (isNaN(amount) || amount <= 0) {
              Swal.fire({
                icon: "warning",
                title: "Invalid Amount",
                text: "Amount cannot be zero or less.",
              });
              return;
            }

            if (amount > balance) {
              Swal.fire({
                icon: "error",
                title: "Insufficient Balance",
                text: "You do not have enough funds to complete this transfer.",
              });
              return;
            }

            pinOverlay.style.display = "flex";
            pinOverlay.setAttribute("data-form-id", form.id);
            pinInputs[0].focus();
          });
        });
      }
    });
});

function clearPinInputs() {
  document
    .querySelectorAll(".pin-input")
    .forEach((input) => (input.value = ""));
}

function formatWithCommas(amount) {
  return Number(amount).toLocaleString();
}
