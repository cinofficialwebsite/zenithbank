document.addEventListener("DOMContentLoaded", function () {
  const form = {
    carrier: document.getElementById("carrier"),
    phone: document.getElementById("phone"),
    amountButtons: document.querySelectorAll(".amount-options button"),
    rechargeFor: document.querySelectorAll('input[name="recharge-for"]'),
    account: document.getElementById("account"),
    button: document.querySelector(".cta-btn"),
    historyList: document.querySelector(".recent-topups ul"),
  };

  let selectedAmount = "$10"; // Default pre-selected
  let customAmount = null;

  // Load stored recharges
  const recharges = JSON.parse(
    localStorage.getItem("airtimeRecharges") || "[]"
  );
  recharges.forEach(addToHistory);

  // Handle amount button selection
  form.amountButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      form.amountButtons.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");

      if (btn.innerText === "Custom") {
        Swal.fire({
          title: "Enter custom amount",
          input: "number",
          inputPlaceholder: "Enter amount in $",
          showCancelButton: true,
          confirmButtonText: "OK",
          inputAttributes: {
            min: 1,
            step: 1,
          },
          inputValidator: (value) => {
            if (!value || isNaN(value) || value <= 0) {
              return "Please enter a valid amount";
            }
          },
        }).then((result) => {
          if (result.isConfirmed) {
            selectedAmount = `$${parseFloat(result.value).toFixed(2)}`;
            btn.innerText = selectedAmount;
          } else {
            // If cancelled, revert to $10
            form.amountButtons[1].classList.add("selected");
            btn.classList.remove("selected");
            btn.innerText = "Custom";
            selectedAmount = "$10";
          }
        });
      } else {
        selectedAmount = btn.innerText;
      }
    });
  });

  form.button.addEventListener("click", () => {
    const carrier = form.carrier.value;
    const phone = form.phone.value.trim();
    const rechargeFor = Array.from(form.rechargeFor).find((r) => r.checked);
    const account = form.account.value;

    // Basic validation
    if (carrier === "Select a carrier") {
      return Swal.fire(
        "Validation Error",
        "Please select a carrier.",
        "warning"
      );
    }
    if (!phone || !/^\d{3}-\d{3}-\d{4}$/.test(phone)) {
      return Swal.fire(
        "Validation Error",
        "Enter a valid US phone number (e.g., 555-123-4567).",
        "warning"
      );
    }
    if (!selectedAmount || selectedAmount === "Custom") {
      return Swal.fire(
        "Validation Error",
        "Please select or enter a valid amount.",
        "warning"
      );
    }
    if (!rechargeFor) {
      return Swal.fire(
        "Validation Error",
        "Please select who you are recharging for.",
        "warning"
      );
    }

    // Simulate recharge
    form.button.disabled = true;
    form.button.innerText = "Processing...";

    setTimeout(() => {
      const entry = {
        carrier,
        phone,
        amount: selectedAmount,
        account,
        ref: Math.floor(Math.random() * 100000),
        time: new Date().toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      };

      recharges.unshift(entry);
      if (recharges.length > 5) recharges.pop(); // Keep recent 5
      localStorage.setItem("airtimeRecharges", JSON.stringify(recharges));

      addToHistory(entry);

      form.button.innerText = "Proceed to Recharge";
      form.button.disabled = false;

      Swal.fire(
        "Success!",
        `Airtime of ${selectedAmount} to ${phone} was successful!`,
        "success"
      );

      // Reset form
      form.phone.value = "";
      form.rechargeFor.forEach((r) => (r.checked = false));
      form.amountButtons.forEach((b) => b.classList.remove("selected"));
      form.amountButtons[1].classList.add("selected");
      selectedAmount = "$10";
      form.amountButtons[5].innerText = "Custom"; // Reset Custom label
    }, 1500);
  });

  function addToHistory(entry) {
    const li = document.createElement("li");
    li.innerHTML = `
        <span>${entry.carrier} – ${entry.phone} – ${entry.amount} – Ref: ${entry.ref}</span>
        <span class="date">${entry.time}</span>
      `;
    form.historyList.prepend(li);
  }
});
