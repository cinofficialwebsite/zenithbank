document.addEventListener("DOMContentLoaded", function () {
  // Enable form inputs
  document
    .querySelectorAll("#bill input, #bill select, #bill button")
    .forEach((el) => {
      el.disabled = false;
    });

  const formFields = {
    type: document.getElementById("bill-type"),
    name: document.getElementById("biller-name"),
    account: document.getElementById("account-number"),
    amount: document.getElementById("bill-amount"),
    payFrom: document.getElementById("pay-from"),
    button: document.querySelector("#bill .cta-btn"),
    list: document.querySelector("#bill .recent-topups ul"),
  };

  const payments = JSON.parse(
    localStorage.getItem("dummyBillPayments") || "[]"
  );
  payments.forEach(addToUI);

  formFields.button.addEventListener("click", function () {
    const { type, name, account, amount, payFrom } = formFields;

    // Validation
    if (!type.value || type.value === "Select bill type") {
      return Swal.fire(
        "Validation Error",
        "Please select a bill type.",
        "warning"
      );
    }
    if (!name.value.trim()) {
      return Swal.fire(
        "Validation Error",
        "Please enter the biller name.",
        "warning"
      );
    }
    if (!account.value.trim() || !/^\d{8,20}$/.test(account.value)) {
      return Swal.fire(
        "Validation Error",
        "Please enter a valid account number (8–20 digits).",
        "warning"
      );
    }
    if (!amount.value || isNaN(amount.value) || parseFloat(amount.value) <= 0) {
      return Swal.fire(
        "Validation Error",
        "Enter a valid payment amount.",
        "warning"
      );
    }
    if (!payFrom.value || payFrom.value === "Select account") {
      return Swal.fire(
        "Validation Error",
        "Please choose a payment source.",
        "warning"
      );
    }

    // Simulate payment processing
    formFields.button.innerText = "Processing...";
    formFields.button.disabled = true;

    setTimeout(() => {
      const payment = {
        name: name.value,
        amount: parseFloat(amount.value).toFixed(2),
        ref: Math.floor(Math.random() * 1000000),
        time: new Date().toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      };

      payments.unshift(payment);
      if (payments.length > 5) payments.pop();
      localStorage.setItem("dummyBillPayments", JSON.stringify(payments));

      addToUI(payment);

      // Reset form
      type.value = "";
      name.value = "";
      account.value = "";
      amount.value = "";
      payFrom.value = "";
      formFields.button.innerText = "Proceed to Pay";
      formFields.button.disabled = false;

      Swal.fire(
        "Success!",
        `Bill payment of $${payment.amount} to ${payment.name} was successful!`,
        "success"
      );
    }, 1500);
  });

  function addToUI(payment) {
    const li = document.createElement("li");
    li.innerHTML = `
        <span>${payment.name} – $${payment.amount} – Ref: ${payment.ref}</span>
        <span class="date">${payment.time}</span>
      `;
    formFields.list.prepend(li);
  }
});
