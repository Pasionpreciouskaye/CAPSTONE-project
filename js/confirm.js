function confirmYes() {
  // Redirect to the login page when the user clicks "Yes"
  console.log("User chose Yes. Redirecting to login.html..."); // Optional: for debugging
  window.location.href = "login.html";
}

function confirmNo() {
  // Redirect back to the landing page when the user clicks "No"
  console.log("User chose No. Redirecting to landing.html..."); // Optional: for debugging
  window.location.href = "landing.html";
}