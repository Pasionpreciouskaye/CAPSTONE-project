const userId = "USER_ID_HERE"; // Change this to the actual user ID

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch(`http://127.0.0.1:8090/api/collections/users/records/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user data");

        const userData = await response.json();

        // Populate fields with user data
        document.getElementById("user-name").innerText = userData.first_name + " " + userData.last_name;
        document.getElementById("first-name").value = userData.first_name;
        document.getElementById("middle-name").value = userData.middle_name;
        document.getElementById("last-name").value = userData.last_name;
        document.getElementById("email").value = userData.email;
        document.getElementById("phone").value = userData.phone;
        document.getElementById("dob").value = userData.dob;
        document.getElementById("address").value = userData.address;
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
});

document.getElementById("profileForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const updatedData = {
        first_name: document.getElementById("first-name").value,
        middle_name: document.getElementById("middle-name").value,
        last_name: document.getElementById("last-name").value,
        phone: document.getElementById("phone").value,
        dob: document.getElementById("dob").value,
        address: document.getElementById("address").value,
    };

    try {
        const response = await fetch("http://127.0.0.1:8090/api/collections/users/records", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) throw new Error("Failed to update profile");

        alert("Profile Updated Successfully!");
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Check console for details.");
    }
});

document.getElementById("discardBtn").addEventListener("click", function () {
    if (confirm("Are you sure you want to discard changes?")) {
        location.reload();
    }
});
