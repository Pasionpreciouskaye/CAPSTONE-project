document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const confirmationModal = document.getElementById("confirmationModal");
  const passwordError = document.getElementById("passwordError");
  const passwordLengthError = document.getElementById("passwordLengthError");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Clear previous errors
    passwordError.textContent = "";
    passwordLengthError.textContent = "";

    const formData = {
      firstName: document.getElementById("firstName").value.trim(),
      middleName: document.getElementById("middleName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      dob: document.getElementById("dob").value.trim(),
      gender: document.getElementById("gender").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      address: document.getElementById("address").value.trim(),
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value,
      passwordConfirm: document.getElementById("confirmPassword").value,
    };

    // Password length validation
    if (formData.password.length < 8) {
      passwordLengthError.textContent = "Password must be at least 8 characters long."; // Display length error
      return;
    }

    // Password confirmation validation
    if (formData.password !== formData.passwordConfirm) {
      passwordError.textContent = "Passwords do not match!"; // Display mismatch error
      return;
    }

    try {
      // Send data to the backend API
      const response = await fetch("http://127.0.0.1:8090/api/collections/users/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: "member",
          emailVisibility: true,
        }),
      });

      const result = await response.json();
      
      // Check for unsuccessful response
      if (!response.ok) {
        let msg = result.message || "Signup failed";
        
        if (result.data) {
          const details = Object.entries(result.data)
            .map(([field, err]) => `${field}: ${err.message}`)
            .join("\n");

          if (details.includes("password")) {
            passwordError.textContent = details;
            return;
          }
          msg += "\n" + details;
        }

        throw new Error(msg);
      }

      // Reset form on success and show confirmation modal
      form.reset();
      confirmationModal.style.display = "flex";
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error.message);  // Displaying a user-friendly alert
    }
  });
});

function confirmYes() {
  window.location.href = "login.html";
}

function confirmNo() {
  window.location.href = "landing.html";
}
