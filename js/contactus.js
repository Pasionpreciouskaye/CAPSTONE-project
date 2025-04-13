document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.querySelector(".contact-form form");

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('input[placeholder="Your Name"]').value.trim();
      const email = contactForm.querySelector('input[placeholder="Your Email"]').value.trim();
      const subject = contactForm.querySelector('input[placeholder="Your Subject"]').value.trim();
      const message = contactForm.querySelector("textarea").value.trim();

      if (!name || !email || !subject || !message) {
        alert("Please fill in all fields.");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8090/api/collections/contact_feedback/records", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, subject, message }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Something went wrong.");
        }

        alert("Thank you for your feedback!");
        contactForm.reset();
      } catch (err) {
        console.error("Error submitting contact form:", err);
        alert("Failed to send your message. Please try again later.");
      }
    });
  });

  // Function to initialize the map
  function initMap() {
    // Location coordinates for the SK Taguig address
    const location = { lat: 14.5628, lng: 121.0398 };

    // Create a map centered at the given location
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: location,
    });

    // Add a marker to the map at the location
    const marker = new google.maps.Marker({
      position: location,
      map: map,
      title: "SK Taguig Location",
    });
  }
