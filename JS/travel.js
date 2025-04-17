document.addEventListener("DOMContentLoaded", function () {
  const travelFields = {
    destination: document.getElementById("destination"),
    date: document.getElementById("travel-date"),
    payFrom: document.getElementById("travel-pay-from"),
    classRadio: document.getElementsByName("travel-class"),
    button: document.querySelector("#travel .cta-btn"),
    list: document.querySelector("#travel .recent-topups ul"),
  };

  const bookings = JSON.parse(
    localStorage.getItem("dummyTravelBookings") || "[]"
  );
  bookings.forEach(addBookingToUI);

  travelFields.button.addEventListener("click", function () {
    const { destination, date, payFrom, classRadio } = travelFields;

    const selectedClass = [...classRadio].find((r) => r.checked)?.value;

    // Validation
    if (!destination.value || destination.value === "Select a destination") {
      return Swal.fire(
        "Validation Error",
        "Please select a destination.",
        "warning"
      );
    }

    if (!date.value) {
      return Swal.fire(
        "Validation Error",
        "Please select a travel date.",
        "warning"
      );
    }

    if (!selectedClass) {
      return Swal.fire(
        "Validation Error",
        "Please choose a travel class.",
        "warning"
      );
    }

    if (!payFrom.value || payFrom.value === "Select account") {
      return Swal.fire(
        "Validation Error",
        "Please choose an account to debit from.",
        "warning"
      );
    }

    // Simulate booking
    travelFields.button.innerText = "Booking...";
    travelFields.button.disabled = true;

    setTimeout(() => {
      const booking = {
        destination: destination.value,
        date: new Date(date.value).toDateString(),
        class: selectedClass,
        ref: Math.floor(Math.random() * 90000) + 10000,
        time: new Date().toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      };

      bookings.unshift(booking);
      if (bookings.length > 5) bookings.pop();
      localStorage.setItem("dummyTravelBookings", JSON.stringify(bookings));

      addBookingToUI(booking);

      destination.value = "";
      date.value = "";
      classRadio.forEach((r) => (r.checked = false));
      payFrom.value = "";
      travelFields.button.innerText = "Proceed to Book";
      travelFields.button.disabled = false;

      Swal.fire(
        "Success!",
        `Travel booked to ${booking.destination} (${booking.class})`,
        "success"
      );
    }, 1500);
  });

  function addBookingToUI(booking) {
    const li = document.createElement("li");
    li.innerHTML = `
        <span>${booking.destination} (${booking.class}) – Ref: ${booking.ref}</span>
        <span class="date">${booking.time}</span>
      `;
    travelFields.list.prepend(li);
  }
});
