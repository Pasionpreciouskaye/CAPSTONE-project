// Array of image paths
const images = [
    './assets/project2.png',
    './assets/proj2 (1).jpg',
    './assets/proj2 (2).jpg',
    './assets/proj2 (3).jpg',
    './assets/proj2 (4).jpg',
    './assets/proj2 (5).jpg',
    './assets/proj2 (6).jpg',
    './assets/proj2 (7).jpg',
    './assets/proj2 (8).jpg',
    './assets/proj2 (9).jpg',
    './assets/proj2 (10).jpg',

    
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

