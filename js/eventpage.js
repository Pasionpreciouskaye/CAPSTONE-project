// Image slider logic
const images = [
  './assets/sk-pic2.jpg',
  './assets/skpic3.jpg',

];

const slider = document.getElementById("slider");
let currentIndex = 0;

function changeImage() {
    currentIndex = (currentIndex + 1) % images.length;
    slider.style.opacity = 0;

    setTimeout(() => {
        slider.src = images[currentIndex];
        slider.style.opacity = 1;
    }, 500);
}

setInterval(changeImage, 2000);

document.addEventListener("DOMContentLoaded", () => {
  const pb = new PocketBase("http://127.0.0.1:8090");
  const eventForm = document.getElementById("eventForm");
  const confirmationModal = document.getElementById("confirmationModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");

  // Handle event registration form submission
  eventForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const phone = document.getElementById("phoneNumber").value.trim();
    const email = document.getElementById("email").value.trim();
    const selectedEvent = document.getElementById("eventSelect").value;

    const user = pb.authStore.model;
    if (!user) {
      alert("You need to log in first.");
      return;
    }

    if (email.toLowerCase() !== user.email.toLowerCase()) {
      showModal(
        "❌ There was an issue with your registration.",
        "Please use the email registered with your account."
      );
      return;
    }

    const data = {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phone,
      email: email,
      selectedEvent: selectedEvent,
      user_id: user.id
    };

    try {
      await pb.collection("event_registrations").create(data);
      eventForm.reset();
      showModal(
        "✅ You have successfully registered for the event!",
        `Thank you for signing up for the ${selectedEvent} event.`
      );

      // Redirect to the event page after modal close
      setTimeout(() => {
        redirectToEventPage(selectedEvent);
      }, 2000); // 2 seconds delay before redirection
    } catch (error) {
      console.error("❌ Error registering:", error);
      showModal(
        "❌ There was an issue with your registration.",
        "Please try again."
      );
    }
  });

  // Show modal with message
  function showModal(title, message) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    confirmationModal.classList.add("visible");
  }

  // Close modal when OK button is clicked
  window.closeModal = function () {
    confirmationModal.classList.remove("visible");
  };

  // Redirect user to the respective event page based on selected event
  function redirectToEventPage(event) {
    let redirectUrl = "";

    switch (event) {
      case "𝐒𝐊𝐋𝐁 𝐊𝐊 𝐈𝐃":
        redirectUrl = "event3.html";
        break;
      case "𝗬𝗢𝗨𝗧𝗛 𝗟𝗘𝗔𝗗𝗘𝗥𝗦 𝗙𝗘𝗟𝗟𝗢𝗪𝗦𝗛𝗜𝗣 2025":
        redirectUrl = "event1.html";
        break;
      case "𝐈𝐍𝐓𝐑𝐀 & 𝐈𝐍𝐓𝐄𝐑 𝐁𝐀𝐑𝐀𝐍𝐆𝐘 2025":
        redirectUrl = "event2.html";
        break;
      case "𝘽𝙄𝙇𝙇𝘼𝙍𝘿𝙎 • 𝘿𝘼𝘿𝘛𝙎 • 𝘾𝙃𝙀𝙎𝙎":
        redirectUrl = "event4.html";
        break;
      default:
        redirectUrl = "eventpage2.html"; // fallback if no match
    }

    window.location.href = redirectUrl;
  }

  // Handle event card clicks to open registration form
  const eventCards = document.querySelectorAll(".event-card");
  eventCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const eventTitle = card.querySelector(".event-title").textContent;

      // Set the selected event in the dropdown
      document.getElementById("eventSelect").value = eventTitle;

      // Optionally, scroll to the form if needed
      document.querySelector(".form-container").scrollIntoView({
        behavior: "smooth"
      });
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
});
