// Array of image paths
const images = [
    '/assets/pic7 (14).jpg',
    '/assets/pic7 (13).jpg',
    '/assets/pic7 (12).jpg',
    '/assets/pic7 (11).jpg',
    '/assets/pic7 (10).jpg',
    '/assets/pic7 (9).jpg',
    '/assets/pic7 (8).jpg',
    '/assets/pic7 (7).jpg',
    '/assets/pic7 (6).jpg',
    '/assets/pic7 (5).jpg',
    '/assets/pic7 (4).jpg',
    '/assets/pic7 (3).jpg',
    '/assets/pic7 (2).jpg',
    '/assets/pic7 (1).jpg',

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

