// Array of image paths
const images = [
    './assets/skbanner.jpg',
    './assets/projects.jpeg.png',
    './assets/sk-pic2.jpg',
    './assets/sk-pic.jpg',
];

// Get reference to the slider
const slider = document.getElementById('slider');

let currentIndex = 0;

// Function to switch images every 3 seconds
function changeImage() {
    currentIndex = (currentIndex + 1) % images.length;
    slider.style.opacity = 0;

    setTimeout(() => {
        slider.src = images[currentIndex];
        slider.style.opacity = 1;
    }, 500);
}

// Change image every 3 seconds
setInterval(changeImage, 3000);
