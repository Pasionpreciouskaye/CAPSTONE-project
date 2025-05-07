document.addEventListener("DOMContentLoaded", () => {
  const resetSuccessMessage = document.getElementById("reset-success-message");
  const newPasswordForm = document.getElementById("newPasswordForm");
  const successMessage = document.getElementById("success-message");

  const pb = new PocketBase("http://127.0.0.1:8090");

  // Get token & user ID from URL params
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const userId = params.get("user");

  if (!token || !userId) {
    alert("Invalid or missing reset token. Please request a new reset link.");
    return;
  }

  // Handle password reset form submission
  newPasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const newPassword = newPasswordForm.newPassword.value;
    const confirmPassword = newPasswordForm.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      // Use PocketBase's built-in confirm method
      await pb.collection("users").confirmPasswordReset(token, userId, newPassword, confirmPassword);

      // Show success message
      successMessage.textContent = "Password Reset Successfully!";
      successMessage.classList.add("show");

      setTimeout(() => {
        successMessage.style.display = "none";
        window.location.href = "login.html";
      }, 3000);
    } catch (err) {
      console.error("Reset failed:", err);
      alert("Failed to reset password. Please try again.");
    }
  });
});
