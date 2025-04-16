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

  // Event Registration Logic
  const eventForm = document.getElementById("eventForm");
  const successMsg = document.getElementById("successMsg");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const eventSelect = document.getElementById("event");

  const pb = new PocketBase("http://127.0.0.1:8090");

  const storedFirstName = localStorage.getItem("firstName");
  const storedMiddleName = localStorage.getItem("middleName");
  const storedLastName = localStorage.getItem("lastName");
  const storedEmail = localStorage.getItem("email");

  if (storedFirstName && storedLastName && storedEmail) {
    nameInput.value = `${storedFirstName} ${storedMiddleName || ""} ${storedLastName}`;
    emailInput.value = storedEmail;
  }

  if (eventForm) {
    eventForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = nameInput.value;
      const email = emailInput.value;
      const selectedEvent = eventSelect.value;

      if (!name || !email || !selectedEvent) {
        alert("Please fill in all fields.");
        return;
      }

      try {
        const data = {
          name: name,
          email: email,
          selectedEvent: selectedEvent,
        };

        await pb.collection("event_registrations").create(data);

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
