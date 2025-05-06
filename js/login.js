// Image slider logic
const images = [
    './assets/sk-pic2.jpg',
    './assets/skpic3.jpg',
];

const slider = document.getElementById("slider");
let currentIndex = 0;

function changeImage() {
    currentIndex = (currentIndex + 1) % images.length;
    slider.style.opacity = 0;

    setTimeout(() => {
        slider.src = images[currentIndex];
        slider.style.opacity = 1;
    }, 500);
}

setInterval(changeImage, 2000);

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const successMessage = document.getElementById("success-message");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        const pb = new PocketBase("http://127.0.0.1:8090");

        try {
            const authData = await pb.collection("users").authWithPassword(email, password);

            if (authData && authData.record && authData.record.role) {
                const role = authData.record.role;

                // Show success message at center bottom
                successMessage.style.display = "block";
                successMessage.style.opacity = "1";
                successMessage.textContent = "Login Successful!";

                // Auto-redirect after 1.5 seconds
                setTimeout(() => {
                    if (role === "admin") {
                        window.location.href = "admin-dashboard.html";
                    } else {
                        window.location.href = "index.html";
                    }
                }, 1500);

            } else {
                console.error("Role not found in authData");
            }

            loginForm.reset();
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed. Check your credentials and try again.");
        }
    });
});
