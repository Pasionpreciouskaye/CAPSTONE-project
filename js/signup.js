document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signupForm");

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
            passwordConfirm: document.getElementById("confirmPassword").value
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
                    first_name: formData.firstName,
                    middle_name: formData.middleName,
                    last_name: formData.lastName,
                    dob: formData.dob,
                    gender: formData.gender,
                    phone: formData.phone,
                    address: formData.address,
                    email: formData.email,
                    password: formData.password,
                    passwordConfirm: formData.passwordConfirm
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Signup failed");
            }

            alert("Signup successful!");
            form.reset();
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Failed to sign up. Check console for details.");
        }
    });
});
