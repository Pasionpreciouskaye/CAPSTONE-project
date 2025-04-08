// Array of image paths
const images = [
    './assets/pic6 (1).jpg',
    './assets/pic6 (2).jpg',
    './assets/pic6 (3).jpg',
    './assets/pic6 (4).jpg',
    './assets/pic6 (5).jpg',
    './assets/pic6 (6).jpg',
    './assets/pic6 (7).jpg',
    './assets/pic6 (8).jpg',
    './assets/pic6 (9).jpg',
    './assets/pic6 (10).jpg',
    './assets/pic6 (11).jpg',
    './assets/pic6 (12).jpg',
    './assets/pic6 (13).jpg',
    './assets/pic6 (14).jpg',
    './assets/pic6 (15).jpg',
    
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

