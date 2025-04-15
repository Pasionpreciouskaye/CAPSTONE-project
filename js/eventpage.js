document.getElementById('eventForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Simulate registration success
    document.getElementById('successMsg').style.display = 'block';

    // Optionally, clear form
    this.reset();

    // Hide message after 4 seconds
    setTimeout(() => {
      document.getElementById('successMsg').style.display = 'none';
    }, 4000);
  });
document.addEventListener("DOMContentLoaded", () => {
  // Menu dropdown logic
  const menuButton = document.getElementById("menuButton");
  const dropdownMenu = document.getElementById("dropdownMenu");
  let dropdownTimeout;

  if (menuButton && dropdownMenu) {
    menuButton.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle("hidden");
    });

    menuButton.addEventListener("mouseenter", () => {
      clearTimeout(dropdownTimeout);
      dropdownMenu.classList.remove("hidden");
    });

    dropdownMenu.addEventListener("mouseenter", () => {
      clearTimeout(dropdownTimeout);
    });

    menuButton.addEventListener("mouseleave", () => {
      dropdownTimeout = setTimeout(() => {
        dropdownMenu.classList.add("hidden");
      }, 300);
    });

    dropdownMenu.addEventListener("mouseleave", () => {
      dropdownTimeout = setTimeout(() => {
        dropdownMenu.classList.add("hidden");
      }, 300);
    });

    document.addEventListener("click", (e) => {
      if (!menuButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.add("hidden");
      }
    });
  }

  // Event registration form logic
  const eventForm = document.getElementById("eventForm");
  const successMsg = document.getElementById("successMsg");

  // Auto-fill name and email from localStorage
  const nameInput = eventForm.name;
  const emailInput = eventForm.email;

  const storedFirstName = localStorage.getItem("firstName");
  const storedMiddleName = localStorage.getItem("middleName");
  const storedLastName = localStorage.getItem("lastName");
  const storedEmail = localStorage.getItem("email");

  if (storedFirstName && storedLastName && storedEmail) {
    nameInput.value = `${storedFirstName} ${storedMiddleName || ""} ${storedLastName}`.trim();
    emailInput.value = storedEmail;
  }

  if (eventForm) {
    eventForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const selectedEvent = eventForm.event.value;

      if (!name || !email || !selectedEvent) {
        alert("Please fill in all fields.");
        return;
      }

      try {
        // Save to PocketBase
        const response = await fetch("http://127.0.0.1:8090/api/collections/event_registrations/records", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            selectedEvent,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Registration failed");
        }

        successMsg.classList.remove("hidden");
        eventForm.reset();

        setTimeout(() => {
          successMsg.classList.add("hidden");
        }, 4000);
      } catch (error) {
        console.error("Registration error:", error);
        alert("Failed to register for the event. Please try again later.");
      }
    });
  }
});