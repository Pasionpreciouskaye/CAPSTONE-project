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
  const forgotPasswordLink = document.querySelector(".forgot-password a");
  const forgotPasswordModal = document.getElementById("forgotPasswordModal");
  const backToLogin = document.getElementById("backToLogin");
  const resetBtn = document.getElementById("resetBtn");
  const pb = new PocketBase("http://127.0.0.1:8090");

  // Handle login form submission
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    try {
      const authData = await pb.collection("users").authWithPassword(email, password);

      if (authData?.record?.role) {
        const role = authData.record.role;

        successMessage.textContent = "Login Successful!";
        successMessage.style.display = "block";
        successMessage.style.opacity = "1";

        setTimeout(() => {
          window.location.href = role === "admin" ? "admin-dashboard.html" : "index.html";
        }, 1500);
      } else {
        alert("Role missing. Please contact administrator.");
      }

      loginForm.reset();
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Check your credentials.");
    }
  });

  // Show forgot password modal
  forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    forgotPasswordModal.classList.remove("hidden");
  });

  // Hide modal and return to login
  backToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    forgotPasswordModal.classList.add("hidden");
  });

  resetBtn.addEventListener("click", async () => {
    const resetEmail = document.getElementById("resetEmail").value.trim();
    const resetMessage = document.getElementById("resetSentMessage");
  
    if (!resetEmail) {
      alert("Please enter your email.");
      return;
    }
  
    try {
      await pb.collection("users").requestPasswordReset(resetEmail);
  
      // Show the message
      resetMessage.style.display = "block";
      resetMessage.classList.add("fade-in");
  
      // Auto-hide after 5 seconds
      setTimeout(() => {
        resetMessage.classList.remove("fade-in");
        resetMessage.style.display = "none";
      }, 5000);
    } catch (err) {
      console.error("Reset request error:", err);
      alert("Failed to send reset link. Please check your email address.");
    }
  });
  
});
