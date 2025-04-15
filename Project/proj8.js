// Array of image paths
const images = [
    '/assets/pic8 (1).jpg',
    '/assets/pic8 (2).jpg',
    '/assets/pic8 (3).jpg',
    '/assets/pic8 (4).jpg',
    '/assets/pic8 (5).jpg',
    '/assets/pic8 (6).jpg',
    '/assets/pic8 (7).jpg',
    '/assets/pic8 (8).jpg',
    '/assets/pic8 (9).jpg',
    '/assets/pic8 (10).jpg',
    '/assets/pic8 (11).jpg',
    '/assets/pic8 (12).jpg',
   
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

