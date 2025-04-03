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

const hamburgerIcon = document.getElementById("hamburger-icon");
const sidebar = document.getElementById("sidebar");
const overlay = document.querySelector(".overlay");
const body = document.body;

hamburgerIcon.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
  body.classList.toggle("no-scroll");
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  body.classList.remove("no-scroll");
});

document.querySelectorAll(".sidebar ul li a").forEach((link) => {
  link.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    body.classList.remove("no-scroll");
    window.location.href = "index.html";
  });
});

sidebar.addEventListener("mouseleave", () => {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  body.classList.remove("no-scroll");
});
