// Array of image paths
const images = [
    './assets/skbanner.jpg',
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

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const role = document.getElementById("role").value;
        const email = loginForm.email.value;
        const password = loginForm.password.value;

        const pb = new PocketBase("http://127.0.0.1:8090");

        try {
            const authData = await pb.collection("users").authWithPassword(email, password);
            
            if (role === "admin") {
                window.location.href = "admin_dashboard.html";
            } else {
                window.location.href = "member_dashboard.html";
            }

            alert("Login successful");
            loginForm.reset();
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed. Check your credentials and try again.");
        }
    });
});
