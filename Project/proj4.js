// Array of image paths
const images = [
    '/assets/pic4 (8).jpg',
    '/assets/pic4 (7).jpg',
    '/assets/pic4 (6).jpg',
    '/assets/pic4 (5).jpg',
    '/assets/pic4 (4).jpg',
    '/assets/pic4 (3).jpg',
    '/assets/pic4 (2).jpg',
    '/assets/pic4 (1).jpg',
];

// Get reference to the image slider container
const sliderContainer = document.querySelector('.image-slider');
  
// Function to create and return an image element
function createImageElement(src) {
  const img = document.createElement('img');
  img.src = src;
  img.style.width = '100%';
  img.style.height = 'auto';
  img.style.objectFit = 'cover';
  img.style.transition = 'opacity 1s ease-in-out';
  return img;
}

let currentIndex = 0;

// Initially add the first image to the slider
let imgElement = createImageElement(images[currentIndex]);
sliderContainer.appendChild(imgElement);

// Function to switch images every 3 seconds
function changeImage() {
  imgElement.style.opacity = 0;

  setTimeout(() => {
    currentIndex = (currentIndex + 1) % images.length;
    imgElement.remove();
    imgElement = createImageElement(images[currentIndex]);
    sliderContainer.appendChild(imgElement);
    imgElement.style.opacity = 1;
  }, 500);
}

setInterval(changeImage, 3000);
