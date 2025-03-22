document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signupForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            dob: document.getElementById("dob").value,
            gender: document.getElementById("gender").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            passwordConfirm: document.getElementById("confirmPassword").value
        };

        if (formData.password !== formData.passwordConfirm) {
            alert("Passwords do not match!");
            console.log(formData)
            return;
        }

        try {
            const response = await fetch("http://localhost:8090/api/collections/users/records", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            if (response.ok) {
                alert("Signup successfully!");
                form.reset();
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Failed to sign up. Try again later.");
        }
    });
});
