const carouselWrapper = document.querySelector(".carousel-wrapper");
const prevButton = document.querySelector(".prev-arrow");
const nextButton = document.querySelector(".next-arrow");

const cardWidth = 260;
let scrollAmount = 0;

function getMaxScroll() {
  return carouselWrapper.scrollWidth - carouselWrapper.clientWidth;
}

function updateArrows() {
  const maxScroll = getMaxScroll();
  prevButton.disabled = scrollAmount <= 0;
  nextButton.disabled = scrollAmount >= maxScroll;
}

nextButton.addEventListener("click", () => {
  const maxScroll = getMaxScroll();
  scrollAmount = Math.min(scrollAmount + cardWidth, maxScroll);
  carouselWrapper.scrollTo({ left: scrollAmount, behavior: "smooth" });
  updateArrows();
});

prevButton.addEventListener("click", () => {
  scrollAmount = Math.max(scrollAmount - cardWidth, 0);
  carouselWrapper.scrollTo({ left: scrollAmount, behavior: "smooth" });
  updateArrows();
});

updateArrows();
