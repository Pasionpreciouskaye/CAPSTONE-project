document.addEventListener("DOMContentLoaded", () => {
  const pb = new PocketBase("http://127.0.0.1:8090");
  const eventForm = document.getElementById("eventForm");

  eventForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Log the form elements to ensure they're being selected correctly
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const phone = document.getElementById("phoneNumber").value;
    const email = document.getElementById("email").value;
    const selectedEvent = document.getElementById("eventSelect").value;

    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Phone:", phone);
    console.log("Email:", email);
    console.log("Selected Event:", selectedEvent);

    // Check if user is authenticated
    const user = pb.authStore.model;  // Get the authenticated user
    if (!user) {
      alert("You need to log in first.");
      return;
    }

    // Create the data object
    const data = {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phone,
      email: email,
      selectedEvent: selectedEvent,
      user_id: user.id  // Associating the event registration with the logged-in user
    };

    // Try to create the event registration in PocketBase
    try {
      await pb.collection("event_registrations").create(data);
      eventForm.reset();  // Reset the form after submission
      alert("✅ You have successfully registered for the event!");
    } catch (error) {
      console.error("❌ Error registering:", error);
      alert("There was an issue with your registration. Please try again.");
    }
  });
});





  // Menu Toggle
  const menuButton = document.querySelector(".menu-button");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  if (menuButton && dropdownMenu) {
    menuButton.addEventListener("click", () => {
      dropdownMenu.classList.toggle("hidden");
    });
  }

  // Image Slider
  const images = [
    "./assets/skpicture (1).jpg",
    "./assets/grouppic.jpg",
    "./assets/grouppic2.jpg",
    "./assets/skpicture (2).jpg",
  ];

  let current = 0;
  const sliderImg = document.querySelector(".slider img");

  function changeImage() {
    if (sliderImg) {
      current = (current + 1) % images.length;
      sliderImg.src = images[current];
    }
  }

  setInterval(changeImage, 3000);

  // Auto-scroll Recent Events
  const scrollContainer = document.querySelector(".events-container");
  let scrollAmount = 0;

  function autoScroll() {
    if (!scrollContainer) return;
    scrollAmount += 1;
    if (
      scrollAmount >=
      scrollContainer.scrollWidth - scrollContainer.clientWidth
    ) {
      scrollAmount = 0;
    }
    scrollContainer.scrollTo({ left: scrollAmount, behavior: "smooth" });
  }

  setInterval(autoScroll, 50);