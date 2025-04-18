const images = [
    './assets/skpicture (1).jpg',
    './assets/grouppic.jpg',
    './assets/grouppic2.jpg',
    './assets/skpicture (2).jpg',
  ];
  
  let current = 0;
  
  function changeImage() {
    const img = document.getElementById("sliderImage");
    current = (current + 1) % images.length;
    img.src = images[current];
  }
  
  setInterval(changeImage, 3000); // change every 3 seconds
  const scrollContainer = document.getElementById('events');
let scrollAmount = 0;

function autoScroll() {
  scrollAmount += 1;
  if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
    scrollAmount = 0;
  }
  scrollContainer.scrollTo({
    left: scrollAmount,
    behavior: 'smooth'
  });
}

setInterval(autoScroll, 50);
