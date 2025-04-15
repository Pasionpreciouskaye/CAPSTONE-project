const carouselWrapper = document.querySelector(".carousel-wrapper");
const prevButton = document.querySelector(".prev-arrow");
const nextButton = document.querySelector(".next-arrow");

let cardWidth = getCardWidth();
let scrollAmount = 0;

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
  autoScroll = setInterval(scrollCarousel, 3000);
});

carouselWrapper.addEventListener("scroll", () => {
  scrollAmount = carouselWrapper.scrollLeft;
  updateArrows();
});

updateArrows();
let currentIndex = 0;
const images = document.querySelectorAll('.image-wrapper img');
const totalImages = images.length;

function showNextImage() {
    currentIndex = (currentIndex + 1) % totalImages;
    updateSliderPosition();
}

function updateSliderPosition() {
    const wrapper = document.querySelector('.image-wrapper');
    const offset = -currentIndex * 100;  // Move the image-wrapper to show the next image
    wrapper.style.transform = `translateX(${offset}%)`;
}

// Auto slide every 3 seconds
setInterval(showNextImage, 3000);
