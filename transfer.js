document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".transfer-form");
  const loadingGif = document.querySelectorAll("img[id^='loadingGif']");

  // Only select input fields in OWN and ZENITH forms
  const ownInput = document.querySelector("#own #accountNumber");
  const zenithInput = document.querySelector("#zenith #accountNumberZenith");

  [ownInput, zenithInput].forEach((input) => {
    input.addEventListener("input", () => {
      const value = input.value;
      const gif = input.parentElement.querySelector("img[id^='loadingGif']");

      // Show loading gif when typing
      if (value.length < 11) {
        gif.style.display = "inline-block";
      } else {
        gif.style.display = "none";
      }

      // Only fetch when 11 digits
      if (value.length === 11) {
        fetch(`http://localhost:5000/api/users/check-account/${value}`)
          .then((res) => res.json())
          .then((data) => {
            let nameLabel = input.parentElement.querySelector(".name-display");

            if (!nameLabel) {
              nameLabel = document.createElement("p");
              nameLabel.className = "name-display";
              input.parentElement.appendChild(nameLabel);
            }

            if (data.fullName) {
              nameLabel.textContent = `Account Name: ${data.fullName}`;
              nameLabel.style.color = "green";
            } else {
              nameLabel.textContent = "Account not found";
              nameLabel.style.color = "red";
            }
          })
          .catch((err) => {
            console.error("Error checking account:", err);
          });
      }

      // Restrict to only numbers
      if (!/^\d*$/.test(value)) {
        input.value = value.replace(/[^\d]/g, "");
      }

      if (value.length >= 11) {
        gif.style.display = "none";
      }
    });
  });

  // Form validation
  function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll("input[required]");
    let valid = true;

    inputs.forEach((input) => {
      if (!input.value) {
        valid = false;
        input.style.border = "1px solid red";
      } else {
        input.style.border = "1px solid green";
      }
    });

    if (!valid) {
      alert("Please fill in all required fields.");
      return false;
    }

    return true;
  }

  // Format amount inputs
  function formatAmount(inputElement) {
    let value = inputElement.value;
    if (!value) return;

    value = value.replace(/[^0-9.]/g, "");
    let parts = value.split(".");
    let wholeNumber = parts[0];
    let decimal = parts[1] ? "." + parts[1] : "";
    wholeNumber = wholeNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    inputElement.value = wholeNumber + decimal;
  }

  const amountInputs = document.querySelectorAll(
    "input[type='text'][placeholder='Amount']"
  );
  amountInputs.forEach((input) => {
    input.addEventListener("input", () => {
      formatAmount(input);
    });
  });

  const amountInput = document.getElementById("amount-input");

  // Function to format the amount with commas and restrict to numbers
  amountInput.addEventListener("input", (event) => {
    let value = event.target.value;

    // Remove any non-numeric characters except the decimal point
    value = value.replace(/[^0-9.]/g, "");

    // Allow only one decimal point
    if ((value.match(/\./g) || []).length > 1) {
      value = value.replace(/\.(?=.*\.)/g, "");
    }

    // Add commas to the number for thousands separators
    value = formatAmount(value);

    // Update the input field value
    event.target.value = value;
  });

  // Function to format the amount with commas
  function formatAmount(value) {
    const parts = value.split(".");
    const integerPart = parts[0];
    const decimalPart = parts[1] ? "." + parts[1] : "";

    // Add commas to the integer part
    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    );

    // Return the formatted value
    return formattedIntegerPart + decimalPart;
  }

  // Format amount inputs: only numbers and auto-comma
  function formatAmountInput(input) {
    input.addEventListener("input", () => {
      // Remove non-digits and commas
      let value = input.value.replace(/[^0-9]/g, "");
      // Format with commas
      input.value = new Intl.NumberFormat().format(value);
    });
  }

  // Apply format to all amount fields
  document
    .querySelectorAll(
      "#own #amount-input, #zenith #amount-input, #other #amount-input, #foreign #amount-input"
    )
    .forEach(formatAmountInput);

  // Digits-only input restriction (max 11 digits handled by HTML maxlength)
  function restrictToDigits(input) {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "");
    });
  }

  // Apply to all account number fields
  const accountFields = [
    "#accountNumber",
    "#accountNumberZenith",
    "#otherAccount",
    "#accountNumberForeign",
    "#beneficiaryAccountNumber",
  ];

  accountFields.forEach((selector) => {
    const input = document.querySelector(selector);
    if (input) restrictToDigits(input);
  });
});
