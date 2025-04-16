const userId = "USER_ID_HERE"; // Change this to the actual user ID
const pb = new PocketBase("http://127.0.0.1:8090");
if (!pb.authStore.isValid) {
    location.href="landing.html"
} 

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const userData = await pb.collection('users').getOne(pb.authStore.model.id);
        console.log (userData)
        //Populate fields with user data
        document.getElementById("firstName").value = userData.firstName;
        document.getElementById("middleName").value = userData.middleName;
        document.getElementById("lastName").value = userData.lastName;
        document.getElementById("email").value = userData.email;
        document.getElementById("phone").value = userData.phone;
        document.getElementById("dob").value = userData.dob;
        document.getElementById("address").value = userData.address;
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const profile_Form = document.getElementById("profile_Form");
    const discardBtn = document.getElementById("discardBtn");
  
    // Make sure the form uses 'submit' event
    profile_Form.addEventListener("submit", saveProfile);
    // Make sure discard cancels and reloads
    discardBtn.addEventListener("click", discardChanges);
  });
  
  async function saveProfile(event) {
    event.preventDefault();  // Prevent form from submitting and reloading
  
    const updatedData = {
        firstName: document.getElementById("firstName").value,
        middleName: document.getElementById("middleName").value,
        lastName: document.getElementById("lastName").value,
        phone: document.getElementById("phone").value,
        dob: document.getElementById("dob").value,
        address: document.getElementById("address").value,
      };
      
  
    console.log("Saving this data:", updatedData);  // Debug log
  
    try {
      if (!pb.authStore.isValid) {
        alert("You must be logged in to update your profile.");
        return;
      }
  
      const userId = pb.authStore.model.id;
      await pb.collection("users").update(userId, updatedData);
      alert("Profile Updated Successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Check console for details.");
    }
  }
  
  function discardChanges() {
    const confirmDiscard = confirm("Are you sure you want to discard changes?");
    if (confirmDiscard) {
      location.reload();  // Refreshes the page to reset the form
    }
  }
  