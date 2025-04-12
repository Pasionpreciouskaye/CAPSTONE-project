// Array of image paths
const images = [
    '/assets/pic3(1).jpg',
    '/assets/pic3 (2).jpg',
    '/assets/pic3 (3).jpg',
    '/assets/pic3 (4).jpg',
    '/assets/pic3 (5).jpg',
    '/assets/pic3 (6).jpg',
    '/assets/pic3 (7).jpg',
    '/assets/pic3 (8).jpg',
    '/assets/pic3 (9).jpg',
    '/assets/pic3 (10).jpg',
    '/assets/pic3 (11).jpg',
    '/assets/pic3 (12).jpg',
    '/assets/pic3 (13).jpg',
    '/assets/pic3 (14).jpg',

    
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

