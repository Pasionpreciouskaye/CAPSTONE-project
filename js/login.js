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

        // Collect form data
        const role = document.getElementById("role").value;
        const email = loginForm.email.value;
        const password = loginForm.password.value;

        try {
            const response = await fetch("http://127.0.0.1:8090/api/collections/login/records", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    identity: FormDataEvent.email,
                    password: FormData.password
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Invalid login credentials");
            }

            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.record));

            if (role === "admin") {
                window.location.href = "admin_dashboard.html";
            } else {
                window.location.href = "member_dashboard.html";
            }

            alert("Login successfully");
            form.reset();
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed. Check your credentials and try again.");
        }
    });
});
