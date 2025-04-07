// Array of image paths
const images = [
    './assets/project1.png',
    './assets/pic1 (9).jpg',
    './assets/pic1 (5).jpg',
    './assets/pic1 (1).jpg',
    './assets/pic1 (2).jpg',
    './assets/pic1 (3).jpg',
    './assets/pic1 (4).jpg',
    './assets/pic1 (5).jpg',
    './assets/pic1 (6).jpg',
    './assets/pic1 (7).jpg',
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

