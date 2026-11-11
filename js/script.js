/* Compassion Cloud interactive behaviour */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".current-year").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.textContent = isOpen ? "Close" : "Menu";
    });
  }

  // Filter the demonstration disaster response cards.
  const disasterFilter = document.querySelector("#disaster-filter");
  if (disasterFilter) {
    disasterFilter.addEventListener("change", event => {
      const selected = event.target.value;
      document.querySelectorAll(".response-card").forEach(card => {
        card.hidden = selected !== "all" && card.dataset.status !== selected;
      });
    });
  }

  const showMessage = (element, message, type) => {
    if (!element) return;
    element.textContent = message;
    element.className = `form-message ${type}`;
  };

  const validateForm = form => {
    if (!form.checkValidity()) {
      form.reportValidity();
      return false;
    }
    return true;
  };

  const reliefForm = document.querySelector("#relief-form");
  const requestList = document.querySelector("#request-list");
  const clearRequests = document.querySelector("#clear-requests");

  const renderRequests = () => {
    if (!requestList) return;
    const requests = JSON.parse(localStorage.getItem("compassionCloudRequests") || "[]");
    requestList.innerHTML = requests.length ? requests.map(request => `
      <article class="request-item">
        <h3>${escapeHtml(request.type)} — ${escapeHtml(request.location)}</h3>
        <p><strong>${escapeHtml(request.name)}</strong> · ${escapeHtml(request.date)}</p>
        <p>${escapeHtml(request.details)}</p>
      </article>
    `).join("") : "<p>No demonstration requests have been submitted yet.</p>";
  };

  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));

  if (reliefForm) {
    reliefForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!validateForm(reliefForm)) return;
      const request = {
        name: document.querySelector("#requester-name").value.trim(),
        email: document.querySelector("#requester-email").value.trim(),
        type: document.querySelector("#request-type").value,
        location: document.querySelector("#request-location").value.trim(),
        details: document.querySelector("#request-details").value.trim(),
        date: new Date().toLocaleDateString()
      };
      const requests = JSON.parse(localStorage.getItem("compassionCloudRequests") || "[]");
      requests.unshift(request);
      localStorage.setItem("compassionCloudRequests", JSON.stringify(requests.slice(0, 10)));
      reliefForm.reset();
      showMessage(document.querySelector("#relief-message"), "Relief request saved successfully for this browser.", "success");
      renderRequests();
    });
  }

  if (clearRequests) {
    clearRequests.addEventListener("click", () => {
      localStorage.removeItem("compassionCloudRequests");
      renderRequests();
    });
  }
  renderRequests();

  const volunteerForm = document.querySelector("#volunteer-form");
  if (volunteerForm) {
    volunteerForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!validateForm(volunteerForm)) return;
      showMessage(document.querySelector("#volunteer-message"), "Thank you. Your volunteer registration has been captured for this demonstration.", "success");
      volunteerForm.reset();
    });
  }

  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!validateForm(contactForm)) return;
      showMessage(document.querySelector("#contact-message-status"), "Thank you. Your message has been prepared successfully for this demonstration.", "success");
      contactForm.reset();
    });
  }
});
