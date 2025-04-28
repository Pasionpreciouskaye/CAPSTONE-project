const pb = new PocketBase("http://127.0.0.1:8090");
if (!pb.authStore.isValid) {
    location.href = "landing.html";
}

let originalData = {};

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const userData = await pb.collection('users').getOne(pb.authStore.model.id);

        document.getElementById("firstName").value = userData.firstName || "";
        document.getElementById("middleName").value = userData.middleName || "";
        document.getElementById("lastName").value = userData.lastName || "";
        document.getElementById("email").value = userData.email || "";
        document.getElementById("phone").value = userData.phone || "";
        document.getElementById("dob").value = userData.dob || "";
        document.getElementById("address").value = userData.address || "";

        originalData = {
            firstName: userData.firstName || "",
            middleName: userData.middleName || "",
            lastName: userData.lastName || "",
            phone: userData.phone || "",
            dob: userData.dob || "",
            address: userData.address || "",
        };
    } catch (error) {
        console.error("Error fetching user data:", error);
    }

    const profile_Form = document.getElementById("profile_Form");
    const discardBtn = document.getElementById("discardBtn");

    profile_Form.addEventListener("submit", saveProfile);
    discardBtn.addEventListener("click", showDiscardModal);
});

function isChanged(updatedData) {
    return Object.keys(updatedData).some(
        (key) => updatedData[key] !== originalData[key]
    );
}

async function saveProfile(event) {
    event.preventDefault();

    const updatedData = {
        firstName: document.getElementById("firstName").value,
        middleName: document.getElementById("middleName").value,
        lastName: document.getElementById("lastName").value,
        phone: document.getElementById("phone").value,
        dob: document.getElementById("dob").value,
        address: document.getElementById("address").value,
    };

    if (!isChanged(updatedData)) {
        alert("No changes detected.");
        return;
    }

    try {
        if (!pb.authStore.isValid) {
            alert("You must be logged in to update your profile.");
            return;
        }

        const userId = pb.authStore.model.id;
        await pb.collection("users").update(userId, updatedData);

        originalData = { ...updatedData }; // Update original data after saving

        showSaveModal();
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile.");
    }
}

// Modal Handling
function showSaveModal() {
    document.getElementById("saveModal").style.display = "flex";
}

function closeSaveModal() {
    document.getElementById("saveModal").style.display = "none";
}

function showDiscardModal() {
    document.getElementById("discardModal").style.display = "flex";
}

function closeDiscardModal() {
    document.getElementById("discardModal").style.display = "none";
}

function confirmDiscard() {
    location.reload();
}
