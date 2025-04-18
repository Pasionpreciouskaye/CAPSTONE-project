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

function changeImage() {
  currentIndex = (currentIndex + 1) % sliderImages.length;
  slider.style.opacity = 0;

  setTimeout(() => {
    slider.src = sliderImages[currentIndex];
    slider.style.opacity = 1;
  }, 500);
}

// Set interval to change images every 2 seconds
setInterval(changeImage, 2100);


// Admin carousel logic (keep this)
const carouselWrapper = document.querySelector(".carousel-wrapper");
const prevButton = document.querySelector(".prev-arrow");
const nextButton = document.querySelector(".next-arrow");

let cardWidth = getCardWidth();
let scrollAmount = 0;

// Ensure that the elements exist
if (carouselWrapper && prevButton && nextButton) {
  function getCardWidth() {
    return window.innerWidth <= 768 ? 200 : 260;
  }

  window.addEventListener("resize", () => {
    cardWidth = getCardWidth();
    updateArrows();
  });

  function getMaxScroll() {
    return carouselWrapper.scrollWidth - carouselWrapper.clientWidth;
  }

  function updateArrows() {
    const maxScroll = getMaxScroll();
    prevButton.disabled = scrollAmount <= 0;
    nextButton.disabled = scrollAmount >= maxScroll;

    prevButton.classList.toggle("disabled", scrollAmount <= 0);
    nextButton.classList.toggle("disabled", scrollAmount >= maxScroll);
  }

  nextButton.addEventListener("click", () => {
    scrollAmount = Math.min(scrollAmount + cardWidth, getMaxScroll());
    carouselWrapper.scrollTo({ left: scrollAmount, behavior: "smooth" });
    updateArrows();
  });

  prevButton.addEventListener("click", () => {
    scrollAmount = Math.max(scrollAmount - cardWidth, 0);
    carouselWrapper.scrollTo({ left: scrollAmount, behavior: "smooth" });
    updateArrows();
  });

  let autoScroll = setInterval(scrollCarousel, 3000);

  function scrollCarousel() {
    if (scrollAmount < getMaxScroll()) {
      scrollAmount += cardWidth;
    } else {
      scrollAmount = 0;
    }
    carouselWrapper.scrollTo({ left: scrollAmount, behavior: "smooth" });
    updateArrows();
  }

  carouselWrapper.addEventListener("mouseenter", () => clearInterval(autoScroll));
  carouselWrapper.addEventListener("mouseleave", () => {
    autoScroll = setInterval(scrollCarousel, 500);
  });

  carouselWrapper.addEventListener("scroll", () => {
    scrollAmount = carouselWrapper.scrollLeft;
    updateArrows();
  });

  updateArrows();
} else {
  console.error("Carousel elements not found");
}

