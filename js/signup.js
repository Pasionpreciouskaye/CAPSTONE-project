document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signupForm");
    const confirmationModal = document.getElementById("confirmationModal");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = {
            firstName: document.getElementById("firstName").value,
            middleName: document.getElementById("middleName").value,
            lastName: document.getElementById("lastName").value,
            dob: document.getElementById("dob").value,
            gender: document.getElementById("gender").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            passwordConfirm: document.getElementById("confirmPassword").value,
        };

        if (formData.password !== formData.passwordConfirm) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8090/api/collections/users/records", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    middleName: formData.middleName,
                    lastName: formData.lastName,
                    dob: formData.dob,
                    gender: formData.gender,
                    phone: formData.phone,
                    address: formData.address,
                    email: formData.email,
                    password: formData.password,
                    passwordConfirm: formData.passwordConfirm,
                    role: "member"
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                let errorMessage = "Signup failed. Please try again.";
                if (result && result.data) {
                    const fieldErrors = Object.entries(result.data)
                        .map(([field, error]) => `${field}: ${error.message}`)
                        .join("\n");
                    if (fieldErrors) errorMessage = `Signup failed:\n${fieldErrors}`;
                    else if (result.message) errorMessage = `Signup failed: ${result.message}`;
                } else if (result && result.message) {
                    errorMessage = `Signup failed: ${result.message}`;
                }
                console.error("Signup Error Response:", result);
                throw new Error(errorMessage);
            }

            form.reset();
            confirmationModal.style.display = "flex";

        } catch (error) {
            console.error("Error submitting form:", error);
            alert(error.message || "Failed to sign up. Check console for details.");
        }
    });
});

function showConfirmationModal() {
    document.querySelector(".modal-overlay").style.display = "flex";
}

function confirmYes() {
    window.location.href = "login.html";
}

function confirmNo() {
    window.location.href = "landing.html";
}

