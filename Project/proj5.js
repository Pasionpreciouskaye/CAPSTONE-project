// Array of image paths
const images = [
    '/assets/pic5 (1).jpg',
    '/assets/pic5 (2).jpg',
    '/assets/pic5 (3).jpg',
    '/assets/pic5 (4).jpg',
    '/assets/pic5 (5).jpg',
    '/assets/pic5 (6).jpg',
    '/assets/pic5 (7).jpg',
    '/assets/pic5 (8).jpg',
    '/assets/pic5 (9).jpg',
    '/assets/pic5 (10).jpg',
    '/assets/pic5 (11).jpg',
    '/assets/pic5 (12).jpg',
    '/assets/pic5 (13).jpg',
    '/assets/pic5 (14).jpg',

    
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

