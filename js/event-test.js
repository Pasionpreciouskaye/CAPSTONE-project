const images = [
    './assets/skpicture (1).jpg',
    './assets/skpicture (2).jpg',
    
  ];
  
  let current = 0;
  
  function changeImage() {
    const img = document.getElementById("sliderImage");
    current = (current + 1) % images.length;
    img.src = images[current];
  }
  
  setInterval(changeImage, 3000); // change every 3 seconds