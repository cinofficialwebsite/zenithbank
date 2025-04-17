let actualBalance = null; // Store actual balance

(function () {
  const tokenData = JSON.parse(localStorage.getItem("authToken") || "null");

  if (!tokenData || !tokenData.value || Date.now() > tokenData.expiry) {
    alert("Session expired or not logged in.");
    localStorage.removeItem("authToken");
    window.location.href = "/HTML/login.html";
  }
})();

// Function to format numbers with commas
function formatAmount(amount) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const menuIcon = document.getElementById("menu-icon");

  // Check the screen width to handle large and small screen behaviors
  if (window.innerWidth <= 768) {
    // For small screens, completely collapse the sidebar
    sidebar.classList.toggle("collapsed");
  } else {
    // For large screens, only collapse the sidebar partially (showing icons)
    sidebar.classList.toggle("partially-collapsed");
  }

  // Toggle between the hamburger and close icons
  if (
    sidebar.classList.contains("collapsed") ||
    sidebar.classList.contains("partially-collapsed")
  ) {
    menuIcon.classList.replace("fa-times", "fa-bars");
  } else {
    menuIcon.classList.replace("fa-bars", "fa-times");
  }
}

function activateMenu(element, sectionId) {
  // Remove the active class from all menu items
  document.querySelectorAll(".sidebar-menu li").forEach((li) => {
    li.classList.remove("active");
  });

  // Add the active class to the clicked menu item
  element.classList.add("active");

  // Remove the active class from all sections
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });

  // Add the active class to the corresponding section
  document.getElementById(sectionId).classList.add("active");

  // Update the URL to reflect the section name
  history.pushState(null, null, `#${sectionId}`);

  // Collapse the sidebar (only partially on larger screens)
  toggleSidebar();

  // Ensure the menu icon is showing (fa-bars) after a section is activated
  const menuIcon = document.getElementById("menu-icon");
  menuIcon.classList.replace("fa-times", "fa-bars");
}

window.addEventListener("popstate", function () {
  // Handle browser back/forward navigation
  const sectionId = location.hash.replace("#", "");
  if (sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      document.querySelectorAll(".sidebar-menu li").forEach((li) => {
        li.classList.remove("active");
      });
      const activeMenuItem = [
        ...document.querySelectorAll(".sidebar-menu li"),
      ].find((li) => {
        return li.getAttribute("onclick")?.includes(sectionId);
      });
      if (activeMenuItem) {
        activeMenuItem.classList.add("active");
      }

      document.querySelectorAll(".section").forEach((section) => {
        section.classList.remove("active");
      });
      section.classList.add("active");
    }
  }
});

function toggleMobileSidebar() {
  const sidebar = document.getElementById("sidebar");
  const mobileMenuIcon = document.getElementById("mobile-menu-icon");

  sidebar.classList.toggle("open");
  sidebar.classList.remove("collapsed");

  if (sidebar.classList.contains("open")) {
    mobileMenuIcon.classList.replace("fa-bars", "fa-times");
  } else {
    mobileMenuIcon.classList.replace("fa-times", "fa-bars");
  }
}

document
  .getElementById("mobile-menu-icon")
  .addEventListener("click", toggleMobileSidebar);

let currentSlideIndex = 0;
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

function changeSlide(index) {
  slides.forEach((slide) => slide.classList.remove("active-slide"));
  dots.forEach((dot) => dot.classList.remove("active-dot"));

  slides[index].classList.add("active-slide");
  dots[index].classList.add("active-dot");
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => changeSlide(index));
});

function autoChangeSlide() {
  currentSlideIndex = (currentSlideIndex + 1) % slides.length;
  changeSlide(currentSlideIndex);
}

changeSlide(currentSlideIndex);
setInterval(autoChangeSlide, 12000); // 12 seconds

document
  .getElementById("toggle-balance")
  .addEventListener("click", function () {
    const balanceAmount = document.getElementById("balance-amount");
    const ledgerAccount = document.getElementById("ledger-account");

    if (balanceAmount.textContent === actualBalance) {
      balanceAmount.textContent = "************";
      if (ledgerAccount)
        ledgerAccount.textContent = "Ledger account: ************";
      this.classList.remove("fa-eye");
      this.classList.add("fa-eye-slash");
    } else {
      balanceAmount.textContent = actualBalance;
      if (ledgerAccount)
        ledgerAccount.textContent = `Ledger account: ${actualBalance}`;
      this.classList.remove("fa-eye-slash");
      this.classList.add("fa-eye");
    }
  });

(function () {
  const accountNumber = localStorage.getItem("currentAccount");

  if (!accountNumber) {
    alert("No account number found. Please log in.");
    window.location.href = "login.html";
  } else {
    fetchUserData(accountNumber);
  }
})();

function fetchUserData(accountNumber) {
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
        throw new Error(`Error fetching user data: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.accountNumber) {
        const fullNameEl = document.getElementById("full-name");
        const balanceAmountEl = document.getElementById("balance-amount");
        const ledgerAccountEl = document.getElementById("ledger-account");
        const mobilePhoneEl = document.getElementById("mobile-phone");
        const midAndLastNameEl = document.getElementById("midandlastname");
        const usernameEl = document.getElementById("username");
        const accountNum = document.getElementById("accountNum");

        actualBalance = formatAmount(data.accountBalance);

        if (balanceAmountEl) balanceAmountEl.textContent = actualBalance; // show by default
        if (ledgerAccountEl)
          ledgerAccountEl.textContent = `Ledger account: ${actualBalance}`;

        if (mobilePhoneEl) mobilePhoneEl.textContent = data.phoneNumber;
        if (fullNameEl)
          fullNameEl.textContent = `${data.firstName} ${data.middleName} ${data.lastName}`;
        if (midAndLastNameEl)
          midAndLastNameEl.textContent = `${data.middleName} ${data.lastName}`;
        if (usernameEl) usernameEl.textContent = `${data.firstName}`;
        if (accountNum) accountNum.textContent = `${data.accountNumber}`;
      } else {
        alert("User data not found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
      alert(
        "An error occurred while fetching your data. Please try again later."
      );
    });
}

const modeButtons = document.querySelectorAll(".mode-btn");
const forms = document.querySelectorAll(".transfer-form");

modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Toggle active class on buttons
    modeButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // Show corresponding form
    forms.forEach((f) => f.classList.remove("active-form"));
    const mode = btn.getAttribute("data-mode");
    document.getElementById(mode).classList.add("active-form");
  });
});

document.getElementById("scrollRight").addEventListener("click", () => {
  document.getElementById("transfer-options").scrollBy({
    left: 150,
    behavior: "smooth",
  });
});
