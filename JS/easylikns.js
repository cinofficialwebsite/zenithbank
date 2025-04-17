// Menu icon click logic
document.querySelectorAll(".icon-item").forEach((item) => {
  item.addEventListener("click", () => {
    const label = item.textContent.trim();

    switch (label) {
      case "Travel & Leisure":
        activateMenu(item, "travel");
        break;
      case "Cable TV":
        activateMenu(item, "bill");
        break;
      case "Cards":
        activateMenu(item, "cards");
        break;
      case "Scheduled Payment":
        activateMenu(item, "scheduled-payment");
        break;
      case "Customize EaZyLinks":
        activateMenu(item, "customize-links");
        break;
      case "Settings":
        activateMenu(item, "settings");
        break;
      default:
        alert("Coming soon...");
    }
  });
});
