// Fade image slider
const sliderImages = [
  './assets/banner.jpg',
  './assets/pic7 (13).jpg',
  './assets/pic8 (3).jpg',
  './assets/pic6 (3).jpg',
  './assets/pic3 (4).jpg',
  './assets/pic3 (5).jpg',
  './assets/pic8 (11).jpg',
  './assets/proj2 (6).jpg',
  './assets/project1.png',
  './assets/recentproj11.jpg',
  './assets/recentproj7.jpg',
  './assets/project5.jpg',
];

const slider = document.getElementById("slider");
let currentIndex = 0;

// Function to change image with fade effect
function changeImage() {
  currentIndex = (currentIndex + 1) % sliderImages.length;
  slider.style.opacity = 0;

  setTimeout(() => {
    slider.src = sliderImages[currentIndex];
    slider.style.transition = "opacity 0.5s ease-in-out";
    slider.style.opacity = 1;
  }, 500);
}

// Set interval to change images every 2.1 seconds
setInterval(changeImage, 2100);


// Admin carousel logic
const carouselWrapper = document.querySelector(".carousel-wrapper");
const prevButton = document.querySelector(".prev-arrow");
const nextButton = document.querySelector(".next-arrow");

let cardWidth = getCardWidth();
let scrollAmount = 0;

// Ensure that the elements exist
if (carouselWrapper && prevButton && nextButton) {
  // Get the card width dynamically based on the first card's actual width
  function getCardWidth() {
    const firstCard = carouselWrapper.querySelector(".admin-card");
    return firstCard ? firstCard.offsetWidth : 260; // Default to 260 if the card is not found
  }

  // Update the card width on window resize
  window.addEventListener("resize", () => {
    cardWidth = getCardWidth();
    updateArrows();  // Update arrows state after resizing
  });

  // Get the maximum scrollable width of the carousel
  function getMaxScroll() {
    return carouselWrapper.scrollWidth - carouselWrapper.clientWidth;
  }

  // Update arrows' disabled state based on current scroll position
  function updateArrows() {
    const maxScroll = getMaxScroll();
    // If scroll is at the beginning, disable the prev button
    prevButton.classList.toggle("disabled", scrollAmount <= 0);
    // If scroll is at the end, disable the next button
    nextButton.classList.toggle("disabled", scrollAmount >= maxScroll);
  }

  // Scroll to the right when next button is clicked
  nextButton.addEventListener("click", () => {
    if (scrollAmount < getMaxScroll()) {
      scrollAmount += cardWidth;
      carouselWrapper.scrollTo({ left: scrollAmount, behavior: "smooth" });
      updateArrows();
    }
  });

  // Scroll to the left when previous button is clicked
  prevButton.addEventListener("click", () => {
    if (scrollAmount > 0) {
      scrollAmount -= cardWidth;
      carouselWrapper.scrollTo({ left: scrollAmount, behavior: "smooth" });
      updateArrows();
    }
  });

  // Update scroll position and arrows' state on manual scroll
  carouselWrapper.addEventListener("scroll", () => {
    scrollAmount = carouselWrapper.scrollLeft;
    updateArrows();
  });

  // Initialize the carousel with the correct arrows state
  updateArrows();
} else {
  console.error("Carousel elements not found");
}
