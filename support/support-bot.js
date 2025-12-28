document.querySelectorAll(".support-btn").forEach(btn => {
  btn.addEventListener("click", () => {

    if (btn.id === "newTicket") {
      window.location.href = "../tickets/ticket-new.html";
      return;
    }

    localStorage.setItem("supportCategory", btn.dataset.cat);
    window.location.href = "support-details.html";
  });
});
