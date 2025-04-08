
// Image slider logic
const images = [
    './assets/skbanner.jpg',
    './assets/sk-pic2.jpg',
    './assets/sk-pic.jpg',
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

            if (authData && authData.record && authData.record.role) {
                const role = authData.record.role; // Extract role from the response
            
                if (role === "admin") {
                    console.log("Admin access granted");
                    window.location.href = "admin_dashboard.html";
                    // Perform admin-specific actions
                } else {
                    console.log("User access granted");
                    window.location.href = "member_dashboard.html";
                    // Perform user-specific actions
                }
            } else {
                console.error("Role not found in authData");
            }

            alert("Login successful");
            loginForm.reset();
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed. Check your credentials and try again.");
        }
    });
});
