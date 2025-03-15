const prevArrow = document.querySelector(".prev-arrow");
const nextArrow = document.querySelector(".next-arrow");
const carouselWrapper = document.querySelector(".carousel-wrapper");
const adminCards = document.querySelectorAll(".admin-card");

let currentIndex = 0;

function updateArrows() {
  if (currentIndex === adminCards.length - 1) {
    nextArrow.disabled = true;
  } else {
    nextArrow.disabled = false;
  }

  if (currentIndex === 0) {
    prevArrow.disabled = true;
  } else {
    prevArrow.disabled = false;
  }
}

nextArrow.addEventListener("click", () => {
  if (currentIndex < adminCards.length - 1) {
    currentIndex++;
    carouselWrapper.style.transform = `translateX(-${currentIndex * 240}px)`;
    updateArrows();
  }
});

prevArrow.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    carouselWrapper.style.transform = `translateX(-${currentIndex * 240}px)`;
    updateArrows();
  }
});

updateArrows();
