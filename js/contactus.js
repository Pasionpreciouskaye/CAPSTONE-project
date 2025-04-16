document.addEventListener("DOMContentLoaded", () => {
  const contact_form = document.getElementById("contact_form");

  contact_form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const subject = contact_form.subject.value;
    const message = contact_form.message.value;

    const pb = new PocketBase("http://127.0.0.1:8090");

    try {
      const data = {
        user: pb.authStore.model.id,
        subject: subject,
        message: message,
      };

      // Create a new record in the "feedbacks" collection
      const record = await pb.collection("feedbacks").create(data);

      // Optional: clear the form or show a success message
      contact_form.reset();
      alert("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  });
});
