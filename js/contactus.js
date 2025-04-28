document.addEventListener("DOMContentLoaded", () => {
  const contact_form = document.getElementById("contact_form");
  const confirmationMessage = document.getElementById('confirmation-message');

  contact_form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const subject = contact_form.subject.value;
    const message = contact_form.message.value;

    const pb = new PocketBase("http://127.0.0.1:8090");

    try {
      const data = {
        subject: subject,
        message: message,
      };

      // Only set the 'user' if logged in
      if (pb.authStore.model) {
        data.user = pb.authStore.model.id;
      }

      // Create a new record in the "feedbacks" collection
      await pb.collection("feedbacks").create(data);

      // Clear the form
      contact_form.reset();

      // Show the success confirmation message
      confirmationMessage.style.display = 'block';
      setTimeout(() => {
        confirmationMessage.style.display = 'none';
      }, 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  });
});
