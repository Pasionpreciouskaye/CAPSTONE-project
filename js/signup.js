document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signupForm");
    const cityDropdown = document.getElementById("city");
    const countryDropdown = document.getElementById("country");

    // Sample list of countries
    const countries = ["Philippines", "United States", "Canada", "United Kingdom", "Australia", "India"];

    // Sample cities per country
    const citiesByCountry = {
        "Philippines": ["Manila", "Cebu", "Davao", "Iloilo"],
        "United States": ["New York", "Los Angeles", "Chicago"],
        "Canada": ["Toronto", "Vancouver", "Montreal"],
        "United Kingdom": ["London", "Manchester", "Birmingham"],
        "Australia": ["Sydney", "Melbourne", "Brisbane"],
        "India": ["Mumbai", "Delhi", "Bangalore"]
    };

    // Populate country dropdown
    countries.forEach(country => {
        let option = document.createElement("option");
        option.value = country;
        option.textContent = country;
        countryDropdown.appendChild(option);
    });

    // Update city dropdown based on selected country
    countryDropdown.addEventListener("change", () => {
        const selectedCountry = countryDropdown.value;
        cityDropdown.innerHTML = '<option disabled selected>Select City</option>'; // Reset city dropdown

        if (citiesByCountry[selectedCountry]) {
            citiesByCountry[selectedCountry].forEach(city => {
                let option = document.createElement("option");
                option.value = city;
                option.textContent = city;
                cityDropdown.appendChild(option);
            });
        }
    });

    // Form submission
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            dob: document.getElementById("dob").value,
            gender: document.getElementById("gender").value,
            age: document.getElementById("age").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            zipCode: document.getElementById("zipCode").value,
            city: document.getElementById("city").value,
            country: document.getElementById("country").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            confirmPassword: document.getElementById("confirmPassword").value
        };

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            if (response.ok) {
                alert("Signup successful!");
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
