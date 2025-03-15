document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const cityDropdown = document.getElementById("city");
    const countryDropdown = document.getElementById("country");

    // Sample list of countries
    const countries = ["Ilo-Ilo", "Manila", "United Kingdom", 
                       "Pasay", "Pasig", "Batangas", "Taguig", "Cavite",
                       "Laguna"];

    // Sample cities per country
    const citiesByCountry = {
        "United States": ["New York", "Los Angeles", "Chicago"],
        "Canada": ["Toronto", "Vancouver", "Montreal"],
        "United Kingdom": ["London", "Manchester", "Birmingham"],
        "Australia": ["Sydney", "Melbourne", "Brisbane"],
        "India": ["Mumbai", "Philippines", "Bangalore"]
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

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = {
            firstName: form.elements[0].value,
            lastName: form.elements[1].value,
            dob: form.elements[2].value,
            gender: form.elements[3].value,
            age: form.elements[4].value,
            phone: form.elements[10].value,
            address: form.elements[5].value,
            zipCode: form.elements[6].value,
            city: form.elements[7].value,
            country: form.elements[8].value,
            email: form.elements[9].value,
            password: form.elements[11].value,
            confirmPassword: form.elements[12].value
        };

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/signup", {
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
